import type { Order, Product, ProductCategory } from "@/stores/types/member";
import { apiService, type IAPIResponse } from "./api";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  pendingOrdersCount: number;
  newReviewsCount: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface TopProduct {
  productId: number;
  name: string;
  category: number;
  sales: number;
  unitsSold: number;
  rating: number;
  reviewCount: number;
  image?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  categories: ProductCategory[];
}

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch all required data in parallel
      const [productsResponse, ordersResponse, customersResponse,productCategoryResponse] = await Promise.all([
        apiService.get<IAPIResponse<Product[]>>("/Products/GetAll"),
        apiService.get<IAPIResponse<Order[]>>("/Orders/GetAll"),
        apiService.get<IAPIResponse<any[]>>("/CustomerProfiles/GetAll"),
        apiService.get<IAPIResponse<ProductCategory[]>>("/ProductCategories/GetAll"),
      ]);

      const products = productsResponse.payload || [];
      const orders = ordersResponse.payload || [];
      const customers = customersResponse.payload || [];
      const categories = productCategoryResponse.payload || [];
      // Calculate dashboard statistics
      const stats = this.calculateStats(products, orders, customers);
      
      // Get recent orders
      const recentOrders = this.getRecentOrders(orders);
      
      // Get top products
      const topProducts = this.getTopProducts(products);

      return {
        stats,
        recentOrders,
        topProducts,
        categories
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  private calculateStats(products: Product[], orders: any[], customers: any[]): DashboardStats {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isVisible !== false).length;
    
    // Mock calculations for now - these would come from analytics endpoints
    const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 10).length;
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
    const newReviewsCount = 0; // Would come from reviews endpoint
    
    // Mock growth percentages - these would come from analytics
    const revenueGrowth = 15.3;
    const orderGrowth = 8.7;
    const customerGrowth = 12.1;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      activeProducts,
      lowStockCount,
      pendingOrdersCount,
      newReviewsCount,
      revenueGrowth,
      orderGrowth,
      customerGrowth
    };
  }

  private getRecentOrders(orders: Order[]): RecentOrder[] {
    return orders
      .sort((a, b) => new Date(b.createdAt || b.orderDate).getTime() - new Date(a.createdAt || a.orderDate).getTime())
      .slice(0, 5)
      .map(order => ({
        orderId: order.orderId?.toString()  || 'N/A',
        customerName: order.customerEmail || 'Unknown',
        total: order.totalAmount  || 0,
        status: order.orderStatus || 'Pending',
        createdAt: order.createdAt || order.orderDate || new Date().toISOString()
      }));
  }

  private getTopProducts(products: any[]): TopProduct[] {
    return products
      .filter(p => p.isVisible !== false)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5)
      .map(product => ({
        productId: product.productId ,
        name: product.productName || 'Unknown Product',
        category: product.categoryId,
        sales:  0,
        unitsSold:  0,
        rating:  0,
        reviewCount: product.reviewCount || 0,
        image: product.mainImageUrl || product.mainImageUrl || '/api/placeholder/150/150'
      }));
  }
}

export const dashboardService = new DashboardService(); 