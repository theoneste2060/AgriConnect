import {
  users,
  farmers,
  products,
  orders,
  orderItems,
  reviews,
  provinces,
  districts,
  sectors,
  productCategories,
  demandPredictions,
  recommendations,
  type User,
  type UpsertUser,
  type Farmer,
  type InsertFarmer,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Province,
  type District,
  type Sector,
  type ProductCategory,
  type Review,
  type DemandPrediction,
  type Recommendation,
} from "@shared/schema";
import { eq, and, sql, desc, asc, like, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  searchUsers(filters: { email?: string; userType?: string }): Promise<User[]>;
  
  // Location operations
  getProvinces(): Promise<Province[]>;
  getDistrictsByProvince(provinceId: string): Promise<District[]>;
  getSectorsByDistrict(districtId: string): Promise<Sector[]>;
  
  // Farmer operations
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  getFarmerById(id: string): Promise<Farmer | undefined>;
  getFarmerByUserId(userId: string): Promise<Farmer | undefined>;
  searchFarmers(filters: {
    provinceId?: string;
    districtId?: string;
    sectorId?: string;
    productCategory?: string;
    maxDistance?: number;
    userLat?: number;
    userLng?: number;
  }): Promise<(Farmer & { user: User })[]>;
  updateFarmerRating(farmerId: string, newRating: number): Promise<void>;
  
  // Product operations
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByFarmer(farmerId: string): Promise<Product[]>;
  getProductCategories(): Promise<ProductCategory[]>;
  searchProducts(filters: {
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<(Product & { farmer: Farmer & { user: User } })[]>;
  
  // Order operations
  createOrder(order: InsertOrder, items: Array<{ productId: string; quantity: number; unitPrice: number }>): Promise<Order>;
  getOrdersByCustomer(customerId: string): Promise<(Order & { farmer: Farmer & { user: User } })[]>;
  getOrdersByFarmer(farmerId: string): Promise<(Order & { customer: User })[]>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;
  
  // Review operations
  createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
  getReviewsByFarmer(farmerId: string): Promise<(Review & { customer: User })[]>;
  
  // ML/AI operations
  saveDemandPrediction(prediction: Omit<DemandPrediction, 'id' | 'createdAt'>): Promise<DemandPrediction>;
  getDemandPredictions(categoryId?: string, provinceId?: string): Promise<DemandPrediction[]>;
  saveRecommendation(recommendation: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation>;
  getRecommendationsForUser(userId: string): Promise<(Recommendation & { product: Product & { farmer: Farmer } })[]>;
  
  // Price comparison
  getProductPriceComparison(categoryId: string, provinceId?: string): Promise<Array<{
    product: Product;
    farmer: Farmer & { user: User };
    distance?: number;
  }>>;

  // Admin operations
  searchUsers(filters: Record<string, any>): Promise<User[]>;
  getAllOrders(): Promise<(Order & { customer: User; farmer: Farmer & { user: User } })[]>;
  getAllProducts(): Promise<(Product & { farmer: Farmer & { user: User } })[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private farmers: Map<string, Farmer> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, any> = new Map();
  private reviews: Map<string, Review> = new Map();
  private demandPredictions: Map<string, DemandPrediction> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  
  // Rwanda location data
  private provinces: Province[] = [
    { id: "kigali", name: "Kigali City", nameKinyarwanda: "Umujyi wa Kigali" },
    { id: "northern", name: "Northern Province", nameKinyarwanda: "Intara y'Amajyaruguru" },
    { id: "southern", name: "Southern Province", nameKinyarwanda: "Intara y'Amajyepfo" },
    { id: "eastern", name: "Eastern Province", nameKinyarwanda: "Intara y'Iburasirazuba" },
    { id: "western", name: "Western Province", nameKinyarwanda: "Intara y'Iburengerazuba" },
  ];
  
  private districts: District[] = [
    { id: "gasabo", name: "Gasabo", nameKinyarwanda: "Gasabo", provinceId: "kigali" },
    { id: "kicukiro", name: "Kicukiro", nameKinyarwanda: "Kicukiro", provinceId: "kigali" },
    { id: "nyarugenge", name: "Nyarugenge", nameKinyarwanda: "Nyarugenge", provinceId: "kigali" },
  ];
  
  private sectors: Sector[] = [
    { id: "remera", name: "Remera", nameKinyarwanda: "Remera", districtId: "gasabo" },
    { id: "kacyiru", name: "Kacyiru", nameKinyarwanda: "Kacyiru", districtId: "gasabo" },
    { id: "niboye", name: "Niboye", nameKinyarwanda: "Niboye", districtId: "kicukiro" },
  ];
  
  private productCategories: ProductCategory[] = [
    { id: "poultry", name: "Poultry", nameKinyarwanda: "Inkoko", description: "Chickens and poultry products" },
    { id: "eggs", name: "Eggs", nameKinyarwanda: "Amagi", description: "Fresh eggs" },
    { id: "manure", name: "Manure", nameKinyarwanda: "Ifumbire", description: "Organic fertilizer" },
  ];

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users with hashed passwords (password is "password123" for all)
    const hashedPassword = "$2b$10$rOzJqQcn9UVaZg5n8rF5NeqGfZGp2wLjzwKqLr1B8YNZBrFv.vLNW"; // bcrypt hash of "password123"
    
    const sampleUsers = [
      {
        id: "farmer1",
        email: "umuhinzi@example.com",
        firstName: "Jean",
        lastName: "Baptiste",
        userType: "farmer",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "farmer2", 
        email: "marie.umuhinzi@example.com",
        firstName: "Marie",
        lastName: "Claire",
        userType: "farmer",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "customer1",
        email: "umukiriya@example.com",
        firstName: "David",
        lastName: "Nzeyimana",
        userType: "customer",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "customer2",
        email: "alice.umukiriya@example.com",
        firstName: "Alice",
        lastName: "Uwimana",
        userType: "customer",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "admin1",
        email: "admin@agriconnect.rw",
        firstName: "Peter",
        lastName: "Karenzi",
        userType: "admin",
        profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user as User));

    // Sample farmers
    const sampleFarmers = [
      {
        id: "farm1",
        userId: "farmer1",
        farmName: "Baptiste Poultry Farm",
        description: "Quality chicken and eggs from Gasabo",
        provinceId: "kigali",
        districtId: "gasabo",
        sectorId: "remera",
        latitude: "-1.9441",
        longitude: "30.0619",
        phone: "+250788123456",
        rating: "4.8",
        totalRatings: 24,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "farm2",
        userId: "farmer2", 
        farmName: "Claire's Organic Farm",
        description: "Fresh organic eggs and poultry",
        provinceId: "kigali",
        districtId: "kicukiro",
        sectorId: "niboye",
        latitude: "-1.9675",
        longitude: "30.1034",
        phone: "+250788654321",
        rating: "4.6",
        totalRatings: 18,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleFarmers.forEach(farmer => this.farmers.set(farmer.id, farmer as Farmer));

    // Sample products
    const sampleProducts = [
      {
        id: "prod1",
        farmerId: "farm1",
        categoryId: "poultry",
        name: "Fresh Chicken",
        nameKinyarwanda: "Inkoko Nshya",
        description: "Free-range chicken",
        unit: "kg",
        pricePerUnit: "4500",
        availableQuantity: 20,
        minOrderQuantity: 1,
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "prod2",
        farmerId: "farm1",
        categoryId: "eggs",
        name: "Fresh Eggs (30 count)",
        nameKinyarwanda: "Amagi Mashya (30)",
        description: "Farm fresh eggs",
        unit: "tray",
        pricePerUnit: "3000",
        availableQuantity: 15,
        minOrderQuantity: 1,
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product as Product));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email ?? existingUser?.email ?? null,
      firstName: userData.firstName ?? existingUser?.firstName ?? null,
      lastName: userData.lastName ?? existingUser?.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? existingUser?.profileImageUrl ?? null,
      userType: userData.userType ?? existingUser?.userType ?? "customer",
      password: userData.password ?? existingUser?.password ?? null,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async searchUsers(filters: { email?: string; userType?: string } | Record<string, any>): Promise<User[]> {
    let filteredUsers = Array.from(this.users.values());
    
    if ('email' in filters && filters.email) {
      filteredUsers = filteredUsers.filter(u => u.email === filters.email);
    }
    if ('userType' in filters && filters.userType) {
      filteredUsers = filteredUsers.filter(u => u.userType === filters.userType);
    }
    
    return filteredUsers;
  }

  async getProvinces(): Promise<Province[]> {
    return this.provinces;
  }

  async getDistrictsByProvince(provinceId: string): Promise<District[]> {
    return this.districts.filter(d => d.provinceId === provinceId);
  }

  async getSectorsByDistrict(districtId: string): Promise<Sector[]> {
    return this.sectors.filter(s => s.districtId === districtId);
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const id = `farm_${Date.now()}`;
    const newFarmer: Farmer = {
      id,
      userId: farmer.userId,
      farmName: farmer.farmName ?? null,
      description: farmer.description ?? null,
      provinceId: farmer.provinceId ?? null,
      districtId: farmer.districtId ?? null,
      sectorId: farmer.sectorId ?? null,
      latitude: farmer.latitude ?? null,
      longitude: farmer.longitude ?? null,
      phone: farmer.phone ?? null,
      rating: "0",
      totalRatings: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.farmers.set(id, newFarmer);
    return newFarmer;
  }

  async getFarmerById(id: string): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }

  async getFarmerByUserId(userId: string): Promise<Farmer | undefined> {
    return Array.from(this.farmers.values()).find(f => f.userId === userId);
  }

  async searchFarmers(filters: {
    provinceId?: string;
    districtId?: string;
    sectorId?: string;
    productCategory?: string;
    maxDistance?: number;
    userLat?: number;
    userLng?: number;
  }): Promise<(Farmer & { user: User })[]> {
    let filteredFarmers = Array.from(this.farmers.values()).filter(f => f.isActive);

    if (filters.provinceId) {
      filteredFarmers = filteredFarmers.filter(f => f.provinceId === filters.provinceId);
    }
    if (filters.districtId) {
      filteredFarmers = filteredFarmers.filter(f => f.districtId === filters.districtId);
    }
    if (filters.sectorId) {
      filteredFarmers = filteredFarmers.filter(f => f.sectorId === filters.sectorId);
    }

    return filteredFarmers.map(farmer => ({
      ...farmer,
      user: this.users.get(farmer.userId)!,
    })).filter(f => f.user);
  }

  async updateFarmerRating(farmerId: string, newRating: number): Promise<void> {
    const farmer = this.farmers.get(farmerId);
    if (farmer) {
      const currentRating = parseFloat(farmer.rating || "0");
      const currentTotal = farmer.totalRatings || 0;
      const newTotal = currentTotal + 1;
      const updatedRating = ((currentRating * currentTotal) + newRating) / newTotal;
      
      farmer.rating = updatedRating.toFixed(2);
      farmer.totalRatings = newTotal;
      farmer.updatedAt = new Date();
      this.farmers.set(farmerId, farmer);
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = `prod_${Date.now()}`;
    const newProduct: Product = {
      id,
      farmerId: product.farmerId,
      categoryId: product.categoryId ?? null,
      name: product.name,
      nameKinyarwanda: product.nameKinyarwanda ?? null,
      description: product.description ?? null,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit.toString(),
      availableQuantity: product.availableQuantity || 0,
      minOrderQuantity: product.minOrderQuantity || 1,
      isAvailable: true,
      imageUrl: product.imageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.farmerId === farmerId);
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return this.productCategories;
  }

  async searchProducts(filters: {
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<(Product & { farmer: Farmer & { user: User } })[]> {
    let filteredProducts = Array.from(this.products.values()).filter(p => p.isAvailable);

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => parseFloat(p.pricePerUnit) >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => parseFloat(p.pricePerUnit) <= filters.maxPrice!);
    }

    return filteredProducts.map(product => {
      const farmer = this.farmers.get(product.farmerId);
      const user = farmer ? this.users.get(farmer.userId) : undefined;
      if (farmer && user) {
        return {
          ...product,
          farmer: { ...farmer, user },
        };
      }
      return null;
    }).filter(Boolean) as (Product & { farmer: Farmer & { user: User } })[];
  }

  async createOrder(order: InsertOrder, items: Array<{ productId: string; quantity: number; unitPrice: number }>): Promise<Order> {
    const id = `order_${Date.now()}`;
    const newOrder: Order = {
      id,
      farmerId: order.farmerId,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      status: "pending",
      deliveryAddress: order.deliveryAddress ?? null,
      deliveryPhone: order.deliveryPhone ?? null,
      notes: order.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);

    // Store order items
    items.forEach((item, index) => {
      const itemId = `${id}_item_${index}`;
      this.orderItems.set(itemId, {
        id: itemId,
        orderId: id,
        ...item,
        totalPrice: (item.quantity * item.unitPrice).toString(),
      });
    });

    return newOrder;
  }

  async getOrdersByCustomer(customerId: string): Promise<(Order & { farmer: Farmer & { user: User } })[]> {
    return Array.from(this.orders.values())
      .filter(o => o.customerId === customerId)
      .map(order => {
        const farmer = this.farmers.get(order.farmerId);
        const user = farmer ? this.users.get(farmer.userId) : undefined;
        if (farmer && user) {
          return { ...order, farmer: { ...farmer, user } };
        }
        return null;
      })
      .filter(Boolean) as (Order & { farmer: Farmer & { user: User } })[];
  }

  async getOrdersByFarmer(farmerId: string): Promise<(Order & { customer: User })[]> {
    return Array.from(this.orders.values())
      .filter(o => o.farmerId === farmerId)
      .map(order => {
        const customer = this.users.get(order.customerId);
        if (customer) {
          return { ...order, customer };
        }
        return null;
      })
      .filter(Boolean) as (Order & { customer: User })[];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      this.orders.set(orderId, order);
    }
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const id = `review_${Date.now()}`;
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);

    // Update farmer rating
    await this.updateFarmerRating(review.farmerId, review.rating);

    return newReview;
  }

  async getReviewsByFarmer(farmerId: string): Promise<(Review & { customer: User })[]> {
    return Array.from(this.reviews.values())
      .filter(r => r.farmerId === farmerId)
      .map(review => {
        const customer = this.users.get(review.customerId);
        if (customer) {
          return { ...review, customer };
        }
        return null;
      })
      .filter(Boolean) as (Review & { customer: User })[];
  }

  async saveDemandPrediction(prediction: Omit<DemandPrediction, 'id' | 'createdAt'>): Promise<DemandPrediction> {
    const id = `pred_${Date.now()}`;
    const newPrediction: DemandPrediction = {
      ...prediction,
      id,
      createdAt: new Date(),
    };
    this.demandPredictions.set(id, newPrediction);
    return newPrediction;
  }

  async getDemandPredictions(categoryId?: string, provinceId?: string): Promise<DemandPrediction[]> {
    let predictions = Array.from(this.demandPredictions.values());
    if (categoryId) {
      predictions = predictions.filter(p => p.productCategoryId === categoryId);
    }
    if (provinceId) {
      predictions = predictions.filter(p => p.provinceId === provinceId);
    }
    return predictions;
  }

  async saveRecommendation(recommendation: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    const id = `rec_${Date.now()}`;
    const newRecommendation: Recommendation = {
      ...recommendation,
      id,
      createdAt: new Date(),
    };
    this.recommendations.set(id, newRecommendation);
    return newRecommendation;
  }

  async getRecommendationsForUser(userId: string): Promise<(Recommendation & { product: Product & { farmer: Farmer } })[]> {
    return Array.from(this.recommendations.values())
      .filter(r => r.userId === userId)
      .map(rec => {
        const product = this.products.get(rec.productId);
        const farmer = product ? this.farmers.get(product.farmerId) : undefined;
        if (product && farmer) {
          return { ...rec, product: { ...product, farmer } };
        }
        return null;
      })
      .filter(Boolean) as (Recommendation & { product: Product & { farmer: Farmer } })[];
  }

  async getProductPriceComparison(categoryId: string, provinceId?: string): Promise<Array<{
    product: Product;
    farmer: Farmer & { user: User };
    distance?: number;
  }>> {
    const products = await this.searchProducts({ categoryId, provinceId });
    return products.map(p => ({
      product: p,
      farmer: p.farmer,
      distance: Math.random() * 10, // Mock distance calculation
    })).sort((a, b) => parseFloat(a.product.pricePerUnit) - parseFloat(b.product.pricePerUnit));
  }

  // Admin operations (using existing searchUsers method above)

  async getAllOrders() {
    const results = [];
    for (const order of Array.from(this.orders.values())) {
      const customer = this.users.get(order.customerId);
      const farmer = this.farmers.get(order.farmerId);
      if (customer && farmer) {
        const farmerUser = this.users.get(farmer.userId);
        if (farmerUser) {
          results.push({
            ...order,
            customer,
            farmer: { ...farmer, user: farmerUser }
          });
        }
      }
    }
    return results;
  }

  async getAllProducts() {
    const results = [];
    for (const product of Array.from(this.products.values())) {
      const farmer = this.farmers.get(product.farmerId);
      if (farmer) {
        const user = this.users.get(farmer.userId);
        if (user) {
          results.push({
            ...product,
            farmer: { ...farmer, user }
          });
        }
      }
    }
    return results;
  }
}

export const storage = new MemStorage();
