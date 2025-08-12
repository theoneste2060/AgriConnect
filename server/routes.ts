import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertFarmerSchema, insertProductSchema, insertOrderSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Email/Password Authentication Routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password, userType } = req.body;
      
      // Check if user already exists
      const existingUsers = await storage.searchUsers({ email });
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.upsertUser({
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        userType: userType || 'customer',
        password: hashedPassword,
      });

      res.json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, userType } = req.body;
      
      // Find user by email
      const users = await storage.searchUsers({ email });
      const user = users.find(u => u.userType === userType);
      
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      };

      res.json({ message: "Login successful", user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Check authentication middleware
  const isEmailAuthenticated = (req: any, res: any, next: any) => {
    if (req.user?.claims?.sub || req.session?.user) {
      req.currentUser = req.user?.claims ? { 
        id: req.user.claims.sub,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
      } : req.session.user;
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.get('/api/auth/user', isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.currentUser.id;
      const user = await storage.getUser(userId);
      if (user) {
        res.json({ ...user, password: undefined });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Location routes
  app.get('/api/locations/provinces', async (req, res) => {
    try {
      const provinces = await storage.getProvinces();
      res.json(provinces);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provinces" });
    }
  });

  app.get('/api/locations/districts/:provinceId', async (req, res) => {
    try {
      const districts = await storage.getDistrictsByProvince(req.params.provinceId);
      res.json(districts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch districts" });
    }
  });

  app.get('/api/locations/sectors/:districtId', async (req, res) => {
    try {
      const sectors = await storage.getSectorsByDistrict(req.params.districtId);
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sectors" });
    }
  });

  // Farmer routes
  app.post('/api/farmers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmerData = insertFarmerSchema.parse({ ...req.body, userId });
      const farmer = await storage.createFarmer(farmerData);
      
      // Update user type to farmer
      await storage.upsertUser({ id: userId, userType: "farmer" });
      
      res.json(farmer);
    } catch (error) {
      console.error("Error creating farmer:", error);
      res.status(400).json({ message: "Failed to create farmer profile" });
    }
  });

  app.get('/api/farmers/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmer = await storage.getFarmerByUserId(userId);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }
      res.json(farmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer profile" });
    }
  });

  app.get('/api/farmers/search', async (req, res) => {
    try {
      const filters = {
        provinceId: req.query.provinceId as string,
        districtId: req.query.districtId as string,
        sectorId: req.query.sectorId as string,
        productCategory: req.query.productCategory as string,
        maxDistance: req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : undefined,
        userLat: req.query.userLat ? parseFloat(req.query.userLat as string) : undefined,
        userLng: req.query.userLng ? parseFloat(req.query.userLng as string) : undefined,
      };
      
      const farmers = await storage.searchFarmers(filters);
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search farmers" });
    }
  });

  // Product routes
  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmer = await storage.getFarmerByUserId(userId);
      if (!farmer) {
        return res.status(403).json({ message: "Only farmers can create products" });
      }

      const productData = insertProductSchema.parse({ ...req.body, farmerId: farmer.id });
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Failed to create product" });
    }
  });

  app.get('/api/products/categories', async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product categories" });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const filters = {
        categoryId: req.query.categoryId as string,
        provinceId: req.query.provinceId as string,
        districtId: req.query.districtId as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };
      
      const products = await storage.searchProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get('/api/products/farmer/:farmerId', async (req, res) => {
    try {
      const products = await storage.getProductsByFarmer(req.params.farmerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer products" });
    }
  });

  // Price comparison route with AI-powered analysis
  app.get('/api/products/price-comparison/:categoryId', async (req, res) => {
    try {
      const { categoryId } = req.params;
      const provinceId = req.query.provinceId as string;
      
      const comparison = await storage.getProductPriceComparison(categoryId, provinceId);
      
      // AI-powered analysis using simple algorithms
      const avgPrice = comparison.reduce((sum, item) => sum + parseFloat(item.product.pricePerUnit), 0) / comparison.length;
      const bestValue = comparison[0]; // Already sorted by price
      
      // Calculate similarity scores (mock TF-IDF + Cosine similarity)
      const analysisResult = comparison.map((item, index) => {
        const price = parseFloat(item.product.pricePerUnit);
        const priceVariance = ((price - avgPrice) / avgPrice) * 100;
        const qualityScore = parseFloat(item.farmer.rating || "0");
        const distanceScore = item.distance ? (10 - item.distance) / 10 : 1;
        
        // Mock similarity score calculation
        const similarityScore = (qualityScore * 0.4 + distanceScore * 0.3 + (price <= avgPrice ? 0.3 : 0.1)).toFixed(4);
        
        return {
          ...item,
          priceVariance: priceVariance.toFixed(1),
          similarityScore,
          recommendation: index === 0 ? "best_value" : priceVariance < -5 ? "good_deal" : "premium"
        };
      });

      res.json({
        products: analysisResult,
        analysis: {
          averagePrice: avgPrice.toFixed(0),
          bestValue: bestValue.farmer.user.firstName + " " + bestValue.farmer.user.lastName,
          totalOptions: comparison.length,
          aiRecommendation: `${bestValue.farmer.user.firstName} is recommended based on price optimization and quality ratings.`
        }
      });
    } catch (error) {
      console.error("Error in price comparison:", error);
      res.status(500).json({ message: "Failed to perform price comparison" });
    }
  });

  // Order routes
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.user.claims.sub;
      const { items, ...orderData } = req.body;
      
      const orderSchema = insertOrderSchema.extend({
        items: z.array(z.object({
          productId: z.string(),
          quantity: z.number(),
          unitPrice: z.number(),
        }))
      });
      
      const validatedData = orderSchema.parse({ ...orderData, customerId, items });
      const order = await storage.createOrder(validatedData, validatedData.items);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders/customer', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.user.claims.sub;
      const orders = await storage.getOrdersByCustomer(customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.get('/api/orders/farmer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmer = await storage.getFarmerByUserId(userId);
      if (!farmer) {
        return res.status(403).json({ message: "Only farmers can view farmer orders" });
      }
      
      const orders = await storage.getOrdersByFarmer(farmer.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer orders" });
    }
  });

  app.patch('/api/orders/:orderId/status', isAuthenticated, async (req: any, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      await storage.updateOrderStatus(orderId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, customerId });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/farmer/:farmerId', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByFarmer(req.params.farmerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer reviews" });
    }
  });

  // ML/AI routes
  app.get('/api/ml/demand-predictions', async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string;
      const provinceId = req.query.provinceId as string;
      
      const predictions = await storage.getDemandPredictions(categoryId, provinceId);
      
      // Generate mock predictions if none exist
      if (predictions.length === 0) {
        const mockPrediction = {
          productCategoryId: categoryId,
          provinceId: provinceId,
          predictedDemand: (Math.random() * 50000 + 30000).toFixed(0),
          confidenceScore: (0.85 + Math.random() * 0.1).toFixed(4),
          predictionDate: new Date(),
        };
        
        const saved = await storage.saveDemandPrediction(mockPrediction);
        res.json([saved]);
      } else {
        res.json(predictions);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demand predictions" });
    }
  });

  app.get('/api/ml/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendations = await storage.getRecommendationsForUser(userId);
      
      // Generate mock recommendations if none exist
      if (recommendations.length === 0) {
        // Simple recommendation algorithm based on user activity
        const allProducts = await storage.searchProducts({});
        const mockRecommendations = allProducts.slice(0, 3).map(product => ({
          userId,
          productId: product.id,
          similarityScore: (0.7 + Math.random() * 0.3).toFixed(4),
          recommendationType: "location",
        }));
        
        for (const rec of mockRecommendations) {
          await storage.saveRecommendation(rec);
        }
        
        const newRecommendations = await storage.getRecommendationsForUser(userId);
        res.json(newRecommendations);
      } else {
        res.json(recommendations);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Admin dashboard routes
  app.get('/api/admin/statistics', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Mock statistics - in real app would calculate from actual data
      const stats = {
        totalFarmers: 1247,
        totalCustomers: 5691,
        totalOrders: 892,
        totalRevenue: "234500000", // RWF
        avgOrderValue: "28500", // RWF
        mlModelAccuracy: "94.2",
        recommendationCTR: "87.5",
        modelConfidence: "91.8",
        topProvinces: [
          { name: "Kigali City", farmers: 423, orders: 298 },
          { name: "Southern Province", farmers: 312, orders: 234 },
          { name: "Northern Province", farmers: 267, orders: 189 },
        ],
        recentActivity: [
          { type: "order", description: "New order from Marie in Gasabo", timestamp: new Date() },
          { type: "farmer", description: "Jean Baptiste updated prices", timestamp: new Date() },
          { type: "prediction", description: "AI predicted high egg demand", timestamp: new Date() },
        ]
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
