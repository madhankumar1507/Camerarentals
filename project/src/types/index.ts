export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Camera {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: CameraCategory;
  description: string;
  features: string[];
  rentPerDay: number;
  images: string[];
  availability: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;    
  totalReviews?: number;
}

export interface Booking {
  id: string;
  userId: string;
  cameraId: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  camera?: Camera;
}

export interface CartItem {
  id: string;
  camera: Camera;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  days: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CameraFilter {
  category?: CameraCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: boolean;
  search?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCameras: number;
  activeBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  popularCameras: Camera[];
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedSpringResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FileUpload {
  file: File;
  url?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

export enum CameraCategory {
  DSLR = 'DSLR',
  MIRRORLESS = 'MIRRORLESS',
  GOPRO = 'GOPRO',
  DRONE = 'DRONE',
  FILM = 'FILM',
  INSTANT = 'INSTANT',
  LENS = 'LENS',
  ACCESSORY = 'ACCESSORY'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  currency: string;
  language: string;
  timezone: string;
}

export interface BookingRequest {
  cameraId: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  totalCost: number;
}

export interface BookingDetails extends Booking {
  user: User;
  camera: Camera;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  cancellationReason?: string;
  returnCondition?: string;
  rating?: number;
  review?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Review {
  id: string;
  userId: string;
  cameraId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: User;
}

export interface CameraStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  utilizationRate: number;
}

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  topCustomers: User[];
}

export interface InventoryItem {
  id: string;
  cameraId: string;
  serialNumber: string;
  condition: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  maintenanceHistory: MaintenanceRecord[];
  status: InventoryStatus;
}

export interface MaintenanceRecord {
  id: string;
  inventoryItemId: string;
  date: Date;
  type: MaintenanceType;
  description: string;
  cost: number;
  technician: string;
  nextMaintenanceDate?: Date;
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED'
}

export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  REPAIR = 'REPAIR',
  UPGRADE = 'UPGRADE',
  INSPECTION = 'INSPECTION'
}

export interface SearchResult {
  cameras: Camera[];
  users: User[];
  bookings: Booking[];
  total: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  timestamp: Date;
  user: User;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  timezone: string;
  enableRegistration: boolean;
  enableGuestBooking: boolean;
  defaultBookingDuration: number;
  maxBookingDuration: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  termsOfService: string;
  privacyPolicy: string;
  emailSettings: EmailSettings;
  paymentSettings: PaymentSettings;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableWelcomeEmail: boolean;
  enableBookingConfirmation: boolean;
  enableReminders: boolean;
}

export interface PaymentSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalClientSecret: string;
  enableStripe: boolean;
  enablePaypal: boolean;
  currency: string;
  processingFee: number;
}

export interface ReportData {
  bookings: BookingReport[];
  revenue: RevenueReport[];
  cameras: CameraReport[];
  users: UserReport[];
  period: ReportPeriod;
}

export interface BookingReport {
  date: string;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

export interface RevenueReport {
  date: string;
  totalRevenue: number;
  bookingRevenue: number;
  fees: number;
  refunds: number;
}

export interface CameraReport {
  cameraId: string;
  cameraName: string;
  totalBookings: number;
  totalRevenue: number;
  utilizationRate: number;
  averageRating: number;
}

export interface UserReport {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  shadow: string;
}

export interface UISettings {
  theme: Theme;
  sidebarCollapsed: boolean;
  showNotifications: boolean;
  language: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  itemsPerPage: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  cameras: Camera[];
  bookings: Booking[];
  cart: CartItem[];
  notifications: NotificationMessage[];
  dashboardStats: DashboardStats | null;
  settings: SystemSettings | null;
  uiSettings: UISettings;
}

export interface Action {
  type: string;
  payload?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterState {
  category: CameraCategory | null;
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  availability: boolean | null;
  search: string | null;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any | null;
}

export interface ToastState {
  messages: NotificationMessage[];
}

export interface HttpError {
  status: number;
  message: string;
  details?: any;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export interface Logger {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error): void;
  debug(message: string, data?: any): void;
}

export interface Analytics {
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

export interface Feature {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface FeatureFlags {
  [key: string]: Feature;
}

export interface Environment {
  production: boolean;
  apiUrl: string;
  appUrl: string;
  version: string;
  buildDate: string;
  features: FeatureFlags;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  robots: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  url?: string;
  icon?: string;
  children?: MenuItem[];
  visible?: boolean;
  role?: string[];
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string;
  breadcrumbs: BreadcrumbItem[];
  menu: MenuItem[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl?: number): void;
  invalidate(key: string): void;
  clear(): void;
}

export interface HttpClient {
  get<T>(url: string, options?: any): Promise<T>;
  post<T>(url: string, data?: any, options?: any): Promise<T>;
  put<T>(url: string, data?: any, options?: any): Promise<T>;
  delete<T>(url: string, options?: any): Promise<T>;
  patch<T>(url: string, data?: any, options?: any): Promise<T>;
}

export interface EventEmitter {
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}

export interface Validator {
  validate(value: any, rules: ValidationRule[]): { isValid: boolean; errors: string[] };
}

export interface DateUtils {
  format(date: Date, format: string): string;
  parse(dateString: string, format: string): Date;
  isValid(date: Date): boolean;
  addDays(date: Date, days: number): Date;
  diffDays(date1: Date, date2: Date): number;
}

export interface NumberUtils {
  format(value: number, options?: any): string;
  parse(value: string): number;
  round(value: number, decimals?: number): number;
  random(min: number, max: number): number;
}

export interface StringUtils {
  capitalize(str: string): string;
  camelCase(str: string): string;
  kebabCase(str: string): string;
  truncate(str: string, length: number): string;
  slugify(str: string): string;
}

export interface ArrayUtils {
  unique<T>(array: T[]): T[];
  groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] };
  sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[];
  chunk<T>(array: T[], size: number): T[][];
}

export interface ObjectUtils {
  merge<T>(...objects: Partial<T>[]): T;
  clone<T>(object: T): T;
  omit<T>(object: T, keys: (keyof T)[]): Partial<T>;
  pick<T>(object: T, keys: (keyof T)[]): Partial<T>;
}

export interface UrlUtils {
  buildUrl(base: string, params?: Record<string, any>): string;
  parseUrl(url: string): { protocol: string; host: string; pathname: string; search: string; hash: string };
  getParams(url: string): Record<string, string>;
}

export interface CryptoUtils {
  encrypt(data: string, key: string): string;
  decrypt(encryptedData: string, key: string): string;
  hash(data: string): string;
  generateToken(length?: number): string;
}

export interface FileUtils {
  getExtension(filename: string): string;
  getMimeType(filename: string): string;
  formatSize(bytes: number): string;
  isImage(filename: string): boolean;
  isDocument(filename: string): boolean;
}

export interface DeviceUtils {
  isMobile(): boolean;
  isTablet(): boolean;
  isDesktop(): boolean;
  getOS(): string;
  getBrowser(): string;
  getScreenSize(): { width: number; height: number };
}

export interface PerformanceUtils {
  measureTime(fn: Function): number;
  debounce(fn: Function, delay: number): Function;
  throttle(fn: Function, delay: number): Function;
  memoize(fn: Function): Function;
}

export interface AccessibilityUtils {
  setFocus(element: HTMLElement): void;
  trapFocus(container: HTMLElement): void;
  announceToScreenReader(message: string): void;
  getAriaLabel(element: HTMLElement): string;
}

export interface SEOUtils {
  updateTitle(title: string): void;
  updateDescription(description: string): void;
  updateKeywords(keywords: string[]): void;
  updateCanonicalUrl(url: string): void;
  updateOpenGraph(data: any): void;
}

export interface SocialShare {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export interface PWAUtils {
  isInstallable(): boolean;
  installApp(): Promise<void>;
  isStandalone(): boolean;
  registerServiceWorker(): Promise<void>;
  checkForUpdates(): Promise<boolean>;
}

export interface I18nUtils {
  translate(key: string, params?: Record<string, any>): string;
  setLocale(locale: string): void;
  getLocale(): string;
  getSupportedLocales(): string[];
  formatDate(date: Date, locale?: string): string;
  formatNumber(number: number, locale?: string): string;
  formatCurrency(amount: number, currency: string, locale?: string): string;
}

export interface TestUtils {
  mockUser(): User;
  mockCamera(): Camera;
  mockBooking(): Booking;
  mockApiResponse<T>(data: T): ApiResponse<T>;
  generateId(): string;
  generateEmail(): string;
  generatePhoneNumber(): string;
  generateAddress(): string;
}

export interface Constants {
  API_ENDPOINTS: {
    AUTH: string;
    USERS: string;
    CAMERAS: string;
    BOOKINGS: string;
    PAYMENTS: string;
    REVIEWS: string;
    UPLOADS: string;
    SETTINGS: string;
    ANALYTICS: string;
  };
  STORAGE_KEYS: {
    AUTH_TOKEN: string;
    USER_PREFERENCES: string;
    CART_ITEMS: string;
    THEME: string;
    LANGUAGE: string;
  };
  ROUTES: {
    HOME: string;
    LOGIN: string;
    REGISTER: string;
    DASHBOARD: string;
    CAMERAS: string;
    BOOKINGS: string;
    PROFILE: string;
    ADMIN: string;
    SETTINGS: string;
  };
  REGEX: {
    EMAIL: RegExp;
    PHONE: RegExp;
    PASSWORD: RegExp;
    URL: RegExp;
    CREDIT_CARD: RegExp;
  };
  LIMITS: {
    MAX_FILE_SIZE: number;
    MAX_UPLOAD_FILES: number;
    MAX_BOOKING_DURATION: number;
    MIN_BOOKING_DURATION: number;
    MAX_CART_ITEMS: number;
  };
  FORMATS: {
    DATE: string;
    TIME: string;
    DATETIME: string;
    CURRENCY: string;
  };
}

export interface AppConfig {
  environment: Environment;
  api: ApiConfig;
  storage: StorageService;
  logger: Logger;
  analytics: Analytics;
  cache: CacheService;
  constants: Constants;
  utils: {
    date: DateUtils;
    number: NumberUtils;
    string: StringUtils;
    array: ArrayUtils;
    object: ObjectUtils;
    url: UrlUtils;
    crypto: CryptoUtils;
    file: FileUtils;
    device: DeviceUtils;
    performance: PerformanceUtils;
    accessibility: AccessibilityUtils;
    seo: SEOUtils;
    pwa: PWAUtils;
    i18n: I18nUtils;
    test: TestUtils;
  };
}

// Re-export commonly used types
export type { User as UserType };
export type { Camera as CameraType };
export type { Booking as BookingType };
export type { CartItem as CartItemType };
export type { NotificationMessage as NotificationType };
export type { DashboardStats as DashboardStatsType };
export type { ApiResponse as ApiResponseType };
export type { PaginatedSpringResponse as PaginatedResponseType };
export type { LoadingState as LoadingStateType };
export type { AppState as AppStateType };
export type { FormState as FormStateType };
export type { Theme as ThemeType };
export type { UISettings as UISettingsType };
export type { Environment as EnvironmentType };
export type { AppConfig as AppConfigType };