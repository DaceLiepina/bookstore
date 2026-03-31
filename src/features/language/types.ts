export interface LoginTranslations {
  title: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  loginButtonLoading: string;
  forgotPasswordLink: string;
  registerPrompt: string;
  registerLink: string;
  errorMessage: string;
  continueWithGoogle: string;
  continueWithFacebook: string;
  divider: string;
  rememberMe: string;
  termsIntro: string;
  termsLink: string;
  and: string;
  privacyLink: string;
  errors: {
    fillAllFields: string;
    validEmail: string;
  };
}

export interface RegisterTranslations {
  title: string;
  nameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  registerButton: string;
  registerButtonLoading: string;
  loginPrompt: string;
  loginLink: string;
  subtitle: string;
  back: string;
  passwordStrength: string;
  strength: {
    weak: string;
    medium: string;
    strong: string;
  };
  agreeTo: string;
  termsLink: string;
  and: string;
  privacyLink: string;
  errors: {
    fillAllFields: string;
    validEmail: string;
    passwordLength: string;
    passwordsMatch: string;
    agreeToTerms: string;
  };
}

export interface DashboardTranslations {
  title: string;
  home: string;
  welcomeMessage: string;
  sections: {
    profile: string;
    orders: string;
    wishlist: string;
    settings: string;
  };
  logoutButton: string;
  memberSince: string;
  stats: {
    booksRead: string;
    orders: string;
    reviews: string;
    wishlist: string;
  };
  recentOrders: string;
  viewAllOrders: string;
  delivered: string;
  recentOrdersData: {
    bookTitle: string;
    orderNumber: string;
  };
  quickActions: {
    title: string;
    continueShopping: string;
    orderHistory: string;
    myWishlist: string;
    accountSettings: string;
  };
  accountInfo: {
    title: string;
    email: string;
    accountType: string;
    readingLevel: string;
  };
  security: {
    title: string;
    changePassword: string;
    changePasswordDesc: string;
    twoFactor: string;
    twoFactorDesc: string;
  };
  shipping: {
    title: string;
    defaultAddress: string;
    defaultAddressValue: string;
    edit: string;
    paymentMethods: string;
    paymentMethodsValue: string;
    manage: string;
  };
}

export interface AuthTranslations {
  login: LoginTranslations;
  register: RegisterTranslations;
  dashboard: DashboardTranslations;
}

export interface BookCardTranslations {
  bestseller: string;
  sale: string;
  addToCart: string;
}

export interface NavTranslations {
  bestseller: string;
  fiction: string;
  nonFiction: string;
  children: string;
  catalog: string;
  audioBooks: string;
  gifts: string;
  sale: string;
}

export interface HeaderTranslations {
  categories: string;
  promo: string;
  storeLocator: string;
  helpContact: string;
  searchPlaceholder: string;
  newReleases: string;
  subscribe: string;
  menu: string;
  more: string;
  logoSubtitle: string;
  nav: NavTranslations;
}

export interface FooterTranslations {
  description: string;
  rights: string;
  links: {
    shop: {
      title: string;
      allBooks: string;
      newReleases: string;
      bestsellers: string;
    };
    help: {
      title: string;
      contactUs: string;
      shipping: string;
      returns: string;
    };
    company: {
      title: string;
      aboutUs: string;
      careers: string;
      privacyPolicy: string;
    };
  };
}

export interface HomeTranslations {
  heroTitle: string;
  heroSubtitle: string;
  shopNow: string;
  viewBestsellers: string;
  browseCategories: string;
  browseCategoriesSubtitle: string;
  books: string;
  bestsellers: string;
  bestsellersSubtitle: string;
  viewAll: string;
  bestseller: string;
  sale: string;
  addToCart: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  emailPlaceholder: string;
  subscribe: string;
  privacyPolicy: string;
  bestsellersError: string;
  categories: {
    fiction: string;
    nonFiction: string;
    science: string;
    business: string;
    children: string;
    romance: string;
    fantasy: string;
    epic: string;
    play: string;
    mystery: string;
    biography: string;
    history: string;
  };
}

export interface CatalogTranslations {
  title: string;
  wTitle: string;
  totalBooks: string;
  wRBooks?: RuPlural; // ru
  wSBooks?: SimplePlural; // en / de
  wishlist: string;
  searchPlaceholder: string;
  sortBy: string;
  sortOptions: {
    title: string;
    price: string;
    rating: string;
  };
  filters: {
    title: string;
    show: string;
    hide: string;
    categories: string;
    priceRange: string;
  };
  viewGrid: string;
  viewList: string;
  resetFilters: string;
  addNewBook: string;
  foundBooks: string;
  noBooksFound: string;
  error: string;
}

export interface BookPageTranslations {
  back: string;
  localBook: string;
  by: string;
  sale: string;
  inStock: string;
  outOfStock: string;
  addToCart: string;
  editBook: string;
  tabs: {
    description: string;
    details: string;
    reviews: string;
  };
  noDescription: string;
  details: {
    isbn: string;
    publicationYear: string;
    language: string;
    category: string;
    rating: string;
    stock: string;
    genres: string;
  };
  reviews: {
    title: string;
    empty: string;
  };
  notFound: string;
  goBack: string;
}

export interface BestsellerTranslations {
  title: string;
  subtitle: string;
  error: string;
}

export interface BookFormTranslations {
  titleAdd: string;
  titleEdit: string;
  subtitleAdd: string;
  subtitleEdit: string;
  sections: {
    basicInfo: string;
    description: string;
    additionalInfo: string;
    flags: string;
  };
  labels: {
    title: string;
    author: string;
    price: string;
    rating: string;
    image: string;
    category: string;
    description: string;
    isbn: string;
    pages: string;
    stock: string;
    publisher: string;
    publicationDate: string;
    language: string;
    bestseller: string;
    sale: string;
    salePrice: string;
  };
  languages: {
    english: string;
    german: string;
    french: string;
    spanish: string;
    russian: string;
    chinese: string;
  };
  buttons: {
    add: string;
    update: string;
    adding: string;
    updating: string;
    cancel: string;
  };
  errors: {
    required: string;
    negativePrice: string;
    ratingRange: string;
    invalidUrl: string;
    minPages: string;
    negativeStock: string;
    saveError: string;
    onlyOwnBooks: string;
    loginRequired: string;
  };
  success: {
    added: string;
    updated: string;
  };
}

export interface Translations {
  auth: AuthTranslations;
  bookCard: BookCardTranslations;
  header: HeaderTranslations;
  footer: FooterTranslations;
  home: HomeTranslations;
  catalog: CatalogTranslations;
  bookPage: BookPageTranslations;
  bestseller: BestsellerTranslations;
  bookForm: BookFormTranslations;
}

export interface RuPlural {
  one: string;
  few: string;
  many: string;
}

export interface SimplePlural {
  one: string;
  other: string;
}
