var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// .angular/showroom-check.ts
import "@angular/compiler";
import assert from "node:assert/strict";
import { Injector } from "@angular/core";
import { firstValueFrom } from "rxjs";

// src/app/core/services/user/user.service.ts
import { Injectable } from "@angular/core";
import { of, throwError } from "rxjs";

// src/app/core/services/auth.mock.ts
var MOCK_ADMIN_CREDENTIALS = {
  email: "admin@giakiet.com",
  password: "admin123"
};
var MOCK_ADMIN_LOGIN_RESPONSE = {
  accessToken: "demo-token",
  user: {
    id: 1,
    fullName: "Alex Mercer",
    email: MOCK_ADMIN_CREDENTIALS.email,
    role: "admin"
  }
};
function isSoleAdmin(user) {
  return user?.id === MOCK_ADMIN_LOGIN_RESPONSE.user.id && user.email.toLowerCase() === MOCK_ADMIN_CREDENTIALS.email && user.role === "admin";
}

// src/app/core/services/user/user.mock.ts
var MOCK_USER_STATS = {
  totalUsers: 28400,
  totalUsersGrowth: 12.5,
  activeUsers: 24800,
  activeUsersGrowth: 8.2,
  newThisMonth: 1402,
  newThisMonthGrowth: 24.1,
  blockedUsers: 142,
  blockedUsersGrowth: -4.8
};
var MOCK_CURRENT_USER = {
  id: 100,
  fullName: "Jonathan Vance",
  email: "jonathan.vance@beverlyhills.org",
  phone: "+1 (310) 555-8422",
  registeredAt: "Jan 01, 2024",
  role: "user",
  status: "active",
  avatarUrl: "/images/avt.jpg",
  location: "Beverly Hills, CA",
  membership: "Elite Member since January 2024"
};
var MOCK_USERS = [
  {
    id: 1,
    fullName: MOCK_ADMIN_LOGIN_RESPONSE.user.fullName,
    email: MOCK_ADMIN_LOGIN_RESPONSE.user.email,
    phone: "+1 (512) 485-2319",
    registeredAt: "Jul 12, 2023",
    role: "admin",
    status: "active"
  },
  {
    id: 2,
    fullName: "Michael Chang",
    email: "m.chang@autodrive.com",
    phone: "+1 (512) 993-4122",
    registeredAt: "Aug 04, 2023",
    role: "seller",
    status: "active"
  },
  {
    id: 3,
    fullName: "Emily Watson",
    email: "emily.w@yahoo.com",
    phone: "+1 (415) 302-8841",
    registeredAt: "Sep 19, 2023",
    role: "user",
    status: "pending"
  },
  {
    id: 4,
    fullName: "David Miller",
    email: "david.miller@fastcars.org",
    phone: "+1 (312) 745-9293",
    registeredAt: "Oct 01, 2023",
    role: "seller",
    status: "active"
  },
  {
    id: 5,
    fullName: "Helena Vance",
    email: "helena.v@outlook.com",
    phone: "+1 (512) 662-8119",
    registeredAt: "Oct 02, 2023",
    role: "user",
    status: "blocked"
  },
  {
    id: 6,
    fullName: "Marcus Sterling",
    email: "marcus.sterling@gmail.com",
    phone: "+1 (201) 441-2309",
    registeredAt: "Oct 14, 2023",
    role: "user",
    status: "active"
  },
  {
    id: 7,
    fullName: "Clara Oswald",
    email: "clara_os@autodrive.com",
    phone: "+1 (512) 808-1123",
    registeredAt: "Oct 15, 2023",
    role: "user",
    status: "active"
  },
  {
    id: 8,
    fullName: "Julian Brooks",
    email: "jbrooks@gmail.com",
    phone: "+1 (310) 902-8812",
    registeredAt: "Oct 19, 2023",
    role: "user",
    status: "pending"
  },
  // Additional customers and showroom sales staff.
  { "id": 20, "fullName": "Nguy\u1EC5n Minh Anh", "email": "seller1@showroom.example", "phone": "0902000001", "registeredAt": "2026-09-01", "role": "seller", "status": "active" },
  { "id": 21, "fullName": "Tr\u1EA7n Ho\xE0ng Nam", "email": "seller2@showroom.example", "phone": "0902000002", "registeredAt": "2026-09-02", "role": "seller", "status": "active" },
  { "id": 22, "fullName": "L\xEA Thanh H\xE0", "email": "seller3@showroom.example", "phone": "0902000003", "registeredAt": "2026-09-03", "role": "seller", "status": "active" },
  { "id": 23, "fullName": "Ph\u1EA1m Qu\u1ED1c Huy", "email": "seller4@showroom.example", "phone": "0902000004", "registeredAt": "2026-09-04", "role": "seller", "status": "active" },
  { "id": 24, "fullName": "V\xF5 Ng\u1ECDc Linh", "email": "seller5@showroom.example", "phone": "0902000005", "registeredAt": "2026-09-05", "role": "seller", "status": "active" },
  { "id": 25, "fullName": "\u0110\u1EB7ng Tu\u1EA5n Ki\u1EC7t", "email": "seller6@showroom.example", "phone": "0902000006", "registeredAt": "2026-09-06", "role": "seller", "status": "active" },
  { "id": 26, "fullName": "B\xF9i Gia B\u1EA3o", "email": "seller7@showroom.example", "phone": "0902000007", "registeredAt": "2026-09-07", "role": "seller", "status": "pending" },
  { "id": 27, "fullName": "\u0110\u1ED7 Kh\xE1nh Vy", "email": "seller8@showroom.example", "phone": "0902000008", "registeredAt": "2026-09-08", "role": "seller", "status": "blocked" },
  { "id": 40, "fullName": "Nguy\u1EC5n \u0110\u1EE9c Anh", "email": "customer1@showroom.example", "phone": "0913000001", "registeredAt": "2026-10-01", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 41, "fullName": "Tr\u1EA7n B\u1EA3o Ng\u1ECDc", "email": "customer2@showroom.example", "phone": "0913000002", "registeredAt": "2026-10-02", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 42, "fullName": "L\xEA Minh Khang", "email": "customer3@showroom.example", "phone": "0913000003", "registeredAt": "2026-10-03", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 43, "fullName": "Ph\u1EA1m Th\u1EA3o Nhi", "email": "customer4@showroom.example", "phone": "0913000004", "registeredAt": "2026-10-04", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 44, "fullName": "Ho\xE0ng Gia H\xE2n", "email": "customer5@showroom.example", "phone": "0913000005", "registeredAt": "2026-10-05", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 45, "fullName": "V\u0169 Quang Minh", "email": "customer6@showroom.example", "phone": "0913000006", "registeredAt": "2026-10-06", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 46, "fullName": "\u0110\u1EB7ng H\u1EA3i \u0110\u0103ng", "email": "customer7@showroom.example", "phone": "0913000007", "registeredAt": "2026-10-07", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 47, "fullName": "B\xF9i Ph\u01B0\u01A1ng Anh", "email": "customer8@showroom.example", "phone": "0913000008", "registeredAt": "2026-10-08", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 48, "fullName": "\u0110\u1ED7 Thi\xEAn Ph\xFAc", "email": "customer9@showroom.example", "phone": "0913000009", "registeredAt": "2026-10-09", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 49, "fullName": "H\u1ED3 Ng\u1ECDc Tr\xE2m", "email": "customer10@showroom.example", "phone": "0913000010", "registeredAt": "2026-10-10", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 50, "fullName": "Ng\xF4 Th\xE0nh \u0110\u1EA1t", "email": "customer11@showroom.example", "phone": "0913000011", "registeredAt": "2026-10-11", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 51, "fullName": "D\u01B0\u01A1ng Mai Chi", "email": "customer12@showroom.example", "phone": "0913000012", "registeredAt": "2026-10-12", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 52, "fullName": "L\xFD Nh\u1EADt Nam", "email": "customer13@showroom.example", "phone": "0913000013", "registeredAt": "2026-10-13", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 53, "fullName": "Tr\u01B0\u01A1ng Kh\xE1nh Linh", "email": "customer14@showroom.example", "phone": "0913000014", "registeredAt": "2026-10-14", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 54, "fullName": "\u0110inh Tu\u1EA5n Anh", "email": "customer15@showroom.example", "phone": "0913000015", "registeredAt": "2026-10-15", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 55, "fullName": "Phan Y\u1EBFn Nhi", "email": "customer16@showroom.example", "phone": "0913000016", "registeredAt": "2026-10-16", "role": "user", "status": "active", "location": "TP. H\u1ED3 Ch\xED Minh" },
  { "id": 101, "fullName": "Demo User", "email": "user@giakiet.com", "phone": "0901234567", "registeredAt": "2026-10-28", "role": "user", "status": "active" },
  // Current logged-in mock user
  MOCK_CURRENT_USER
];
var MOCK_USERS_TOTAL = MOCK_USERS.length;

// src/app/core/services/user/user.service.ts
var UserService = class {
  storageKey = "mock_user_directory";
  bookingUsers = /* @__PURE__ */ new Set();
  users = MOCK_USERS.map((user) => ({ ...user }));
  passwords = {};
  versions = {};
  currentUser = { ...MOCK_CURRENT_USER };
  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) ?? "null");
      if (saved && Array.isArray(saved.users)) {
        this.users = saved.users.filter((user) => user.id !== 1 && user.email.toLowerCase() !== MOCK_ADMIN_CREDENTIALS.email).map((user) => ({ ...user, role: user.role === "admin" ? "user" : user.role }));
        this.users.unshift({ ...MOCK_USERS[0] });
        this.passwords = saved.passwords ?? {};
        this.versions = saved.versions ?? {};
      }
    } catch {
    }
    for (const user of this.users) {
      this.passwords[user.id] ??= user.role === "seller" ? "seller123" : "user123";
      this.versions[user.id] ??= 0;
    }
    this.passwords[1] = MOCK_ADMIN_CREDENTIALS.password;
    this.currentUser = { ...this.users.find((user) => user.id === MOCK_CURRENT_USER.id) ?? MOCK_CURRENT_USER };
  }
  getSnapshot() {
    return this.users.map((user) => ({ ...user }));
  }
  retainForBooking(id) {
    this.bookingUsers.add(id);
  }
  credentialVersion(id) {
    return this.versions[id] ?? 0;
  }
  authenticate(email, password) {
    const user = this.users.find((user2) => user2.email.toLowerCase() === email.trim().toLowerCase());
    return user && this.passwords[user.id] === password ? { ...user } : null;
  }
  getCurrentUser() {
    return of({ ...this.currentUser });
  }
  updateCurrentUser(changes) {
    return this.update(this.currentUser.id, { ...changes, id: this.currentUser.id });
  }
  getList(query) {
    const search = query.search?.trim().toLowerCase();
    const result = this.users.filter((user) => (!search || [user.fullName, user.email, user.phone].some((value) => value.toLowerCase().includes(search))) && (!query.role || query.role === "all" || user.role === query.role) && (!query.status || query.status === "all" || user.status === query.status));
    const start = (query.page - 1) * query.pageSize;
    const now = /* @__PURE__ */ new Date();
    return of({
      items: result.slice(start, start + query.pageSize).map((user) => ({ ...user })),
      total: result.length,
      page: query.page,
      pageSize: query.pageSize,
      stats: {
        ...MOCK_USER_STATS,
        totalUsers: this.users.length,
        activeUsers: this.users.filter((user) => user.status === "active").length,
        blockedUsers: this.users.filter((user) => user.status === "blocked").length,
        newThisMonth: this.users.filter((user) => {
          const date = new Date(user.registeredAt);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length
      }
    });
  }
  create(input2) {
    const error = this.validateChanges(input2);
    if (error) return throwError(() => new Error(error));
    const { password, ...profile } = input2;
    const user = {
      ...profile,
      id: Math.max(0, ...this.users.map((user2) => user2.id)) + 1,
      email: input2.email.trim().toLowerCase(),
      registeredAt: input2.registeredAt || (/* @__PURE__ */ new Date()).toISOString()
    };
    this.users = [...this.users, user];
    this.passwords[user.id] = password || (user.role === "seller" ? "seller123" : "user123");
    this.versions[user.id] = 0;
    this.persist();
    return of({ ...user });
  }
  update(id, changes) {
    if (id === MOCK_ADMIN_LOGIN_RESPONSE.user.id) return this.adminProtected();
    const error = this.validateChanges(changes, id);
    if (error) return throwError(() => new Error(error));
    const current = this.users.find((user) => user.id === id);
    if (!current) return throwError(() => new Error("Kh\xF4ng t\xECm th\u1EA5y d\u1EEF li\u1EC7u."));
    if (this.bookingUsers.has(id) && changes.role && changes.role !== current.role) {
      return throwError(() => new Error("Kh\xF4ng th\u1EC3 \u0111\u1ED5i vai tr\xF2 ng\u01B0\u1EDDi d\xF9ng \u0111\xE3 c\xF3 l\u1ECBch l\xE1i th\u1EED."));
    }
    const { password, ...profile } = changes;
    const updated = { ...current, ...profile, id, email: changes.email?.trim().toLowerCase() ?? current.email };
    this.users = this.users.map((user) => user.id === id ? updated : user);
    if (password) {
      this.passwords[id] = password;
      this.versions[id] = this.credentialVersion(id) + 1;
    }
    if (id === this.currentUser.id) this.currentUser = { ...updated };
    this.persist();
    return of({ ...updated });
  }
  delete(id) {
    if (id === 1) return this.adminProtected();
    if (this.bookingUsers.has(id)) return throwError(() => new Error("Ng\u01B0\u1EDDi d\xF9ng \u0111ang \u0111\u01B0\u1EE3c li\xEAn k\u1EBFt v\u1EDBi l\u1ECBch l\xE1i th\u1EED; kh\xF4ng th\u1EC3 xo\xE1 ho\u1EB7c kho\xE1."));
    this.users = this.users.filter((user) => user.id !== id);
    delete this.passwords[id];
    delete this.versions[id];
    this.persist();
    return of(void 0);
  }
  toggleBlock(id) {
    if (id === 1) return this.adminProtected();
    if (this.bookingUsers.has(id)) return throwError(() => new Error("Ng\u01B0\u1EDDi d\xF9ng \u0111ang \u0111\u01B0\u1EE3c li\xEAn k\u1EBFt v\u1EDBi l\u1ECBch l\xE1i th\u1EED; kh\xF4ng th\u1EC3 xo\xE1 ho\u1EB7c kho\xE1."));
    this.users = this.users.map((user) => user.id === id ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user);
    this.persist();
    return of(void 0);
  }
  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify({ users: this.users, passwords: this.passwords, versions: this.versions }));
  }
  adminProtected() {
    return throwError(() => new Error("T\xE0i kho\u1EA3n qu\u1EA3n tr\u1ECB duy nh\u1EA5t kh\xF4ng th\u1EC3 s\u1EEDa, xo\xE1 ho\u1EB7c kho\xE1."));
  }
  validateChanges(changes, id) {
    if (changes.password && changes.password.length < 6) return "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 6 k\xFD t\u1EF1.";
    if (changes.role !== void 0 && !["user", "seller"].includes(changes.role)) return "Ch\u1EC9 \u0111\u01B0\u1EE3c t\u1EA1o ho\u1EB7c c\u1EADp nh\u1EADt t\xE0i kho\u1EA3n User v\xE0 Seller.";
    if (changes.email !== void 0) {
      const email = changes.email.trim().toLowerCase();
      if (email === MOCK_ADMIN_CREDENTIALS.email || this.users.some((user) => user.id !== id && user.email.toLowerCase() === email)) {
        return "Email \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng ho\u1EB7c d\xE0nh ri\xEAng cho qu\u1EA3n tr\u1ECB vi\xEAn.";
      }
    }
    return null;
  }
};
UserService = __decorateClass([
  Injectable({ providedIn: "root" })
], UserService);

// src/app/core/services/seller/seller.service.ts
import { Injectable as Injectable2, inject } from "@angular/core";
import { of as of2, defer, map, tap } from "rxjs";

// src/app/core/services/seller/seller.mock.ts
var MOCK_SELLERS = MOCK_USERS.filter((user) => user.role === "seller").map((user) => ({
  id: user.id,
  userId: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  company: "Showroom",
  listings: 0,
  joinDate: user.registeredAt,
  status: user.status === "active" ? "verified" : user.status === "blocked" ? "suspended" : "pending"
}));
var MOCK_SELLERS_TOTAL = MOCK_SELLERS.length;
var MOCK_SELLER_STATS = {
  totalSellers: MOCK_SELLERS.length,
  totalSellersGrowth: 0,
  verified: MOCK_SELLERS.filter((seller) => seller.status === "verified").length,
  verifiedGrowth: 0,
  pendingVerification: MOCK_SELLERS.filter((seller) => seller.status === "pending").length,
  pendingVerificationGrowth: 0,
  suspended: MOCK_SELLERS.filter((seller) => seller.status === "suspended").length,
  suspendedGrowth: 0
};

// src/app/core/services/seller/seller.service.ts
var SellerService = class {
  users = inject(UserService);
  details = /* @__PURE__ */ new Map();
  create(input2) {
    return defer(() => {
      this.validate(input2);
      return this.users.create({
        fullName: input2.fullName.trim(),
        email: input2.email,
        phone: input2.phone.trim(),
        registeredAt: input2.joinDate,
        role: "seller",
        status: this.userStatus(input2.status)
      }).pipe(
        tap((user) => this.details.set(user.id, { company: input2.company.trim() })),
        map((user) => this.getSnapshot().find((seller) => seller.id === user.id))
      );
    });
  }
  update(id, input2) {
    return defer(() => {
      this.validate(input2);
      if (!this.getSnapshot().some((seller) => seller.id === id)) throw new Error("Kh\xF4ng t\xECm th\u1EA5y seller.");
      return this.users.update(id, {
        fullName: input2.fullName.trim(),
        email: input2.email,
        phone: input2.phone.trim(),
        registeredAt: input2.joinDate,
        role: "seller",
        status: this.userStatus(input2.status)
      }).pipe(
        tap(() => this.details.set(id, { company: input2.company.trim() })),
        map(() => this.getSnapshot().find((seller) => seller.id === id))
      );
    });
  }
  delete(id) {
    return defer(() => {
      if (!this.getSnapshot().some((seller) => seller.id === id)) throw new Error("Kh\xF4ng t\xECm th\u1EA5y seller.");
      return this.users.delete(id).pipe(tap(() => this.details.delete(id)));
    });
  }
  userStatus(status) {
    return status === "verified" ? "active" : status === "suspended" ? "blocked" : "pending";
  }
  validate(input2) {
    if (!input2.fullName.trim() || input2.fullName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input2.email.trim()) || !/^[+]?[-\d\s().]{7,20}$/.test(input2.phone.trim()) || !input2.company.trim() || input2.company.length > 100 || !Number.isFinite(Date.parse(input2.joinDate)) || !["verified", "pending", "suspended"].includes(input2.status)) {
      throw new Error("Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 th\xF4ng tin seller h\u1EE3p l\u1EC7.");
    }
  }
  getSnapshot() {
    return this.users.getSnapshot().filter((user) => user.role === "seller").map((user) => ({
      id: user.id,
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      company: this.details.get(user.id)?.company ?? "Showroom",
      listings: 0,
      joinDate: user.registeredAt,
      status: user.status === "active" ? "verified" : user.status === "blocked" ? "suspended" : "pending"
    }));
  }
  getList(query) {
    let result = this.getSnapshot();
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(
        (s) => s.fullName.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.company.toLowerCase().includes(search) || s.phone.includes(search)
      );
    }
    if (query.date) {
      const filterDate = new Date(query.date);
      result = result.filter((s) => {
        const sDate = new Date(s.joinDate);
        return sDate.getFullYear() === filterDate.getFullYear() && sDate.getMonth() === filterDate.getMonth() && sDate.getDate() === filterDate.getDate();
      });
    }
    if (query.status && query.status !== "all") {
      result = result.filter((s) => s.status === query.status);
    }
    const total = result.length;
    const start = (query.page - 1) * query.pageSize;
    const items = result.slice(start, start + query.pageSize);
    return of2({
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      stats: { ...MOCK_SELLER_STATS, totalSellers: this.getSnapshot().length, verified: this.getSnapshot().filter((s) => s.status === "verified").length, pendingVerification: this.getSnapshot().filter((s) => s.status === "pending").length, suspended: this.getSnapshot().filter((s) => s.status === "suspended").length }
    });
  }
};
SellerService = __decorateClass([
  Injectable2({ providedIn: "root" })
], SellerService);

// src/app/core/services/vehicle/vehicle.mock.ts
var MOCK_VEHICLES = [
  {
    id: 1,
    brand: "BMW",
    model: "M4 Competition",
    year: 2023,
    price: 78500,
    stockQuantity: 5,
    color: "Isle of Man Green",
    imageUrl: "/images/car1.jpg",
    status: "available",
    condition: "new",
    fuelType: "Petrol",
    transmission: "Auto",
    bodyType: "Coupe",
    engine: "3.0L Twin-Turbo Inline-6",
    horsepower: "503 hp",
    drivetrain: "RWD",
    featured: true
  },
  {
    id: 2,
    brand: "Ferrari",
    model: "296 GTB",
    year: 2022,
    price: 34e4,
    stockQuantity: 3,
    color: "Blue",
    imageUrl: "/images/vehicle-placeholder.svg",
    status: "available",
    condition: "new",
    fuelType: "Hybrid",
    transmission: "8-Speed DCT",
    bodyType: "Coupe",
    engine: "3.0L Twin-Turbo V6 Hybrid",
    horsepower: "819 hp",
    drivetrain: "AWD",
    featured: true
  },
  {
    id: 3,
    brand: "Porsche",
    model: "911 Carrera S",
    year: 2021,
    price: 115e3,
    stockQuantity: 4,
    color: "Red",
    imageUrl: "/images/car3.jpg",
    status: "available",
    condition: "new",
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Coupe",
    engine: "3.0L Twin-Turbo Flat-6",
    horsepower: "443 hp",
    drivetrain: "RWD",
    featured: true
  },
  {
    id: 4,
    brand: "Audi",
    model: "RS e-tron GT",
    year: 2024,
    price: 102e3,
    stockQuantity: 2,
    color: "Black",
    imageUrl: "/images/car4.jpg",
    status: "available",
    condition: "new",
    fuelType: "Electric",
    transmission: "Auto",
    bodyType: "Sedan",
    engine: "Dual Electric Motors",
    horsepower: "637 hp",
    drivetrain: "AWD",
    featured: true
  },
  // ============================
  // DETAIL CAR
  // ============================
  {
    id: 5,
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    price: 223800,
    stockQuantity: 2,
    color: "GT Silver Metallic",
    imageUrl: "/images/detail/porsche-main.jpg",
    status: "available",
    condition: "new",
    fuelType: "Premium Petrol",
    transmission: "7-Speed PDK Auto",
    bodyType: "Coupe",
    engine: "4.0L Naturally Aspirated Boxer-6",
    horsepower: "518 hp",
    drivetrain: "RWD",
    listingId: "AD-84029",
    images: [
      "/images/detail/porsche-main.jpg",
      "/images/detail/porsche-1.jpg",
      "/images/detail/porsche-2.jpg",
      "/images/detail/porsche-3.jpg",
      "/images/detail/porsche-4.jpg"
    ],
    seller: {
      name: "Metropolitan Porsche",
      avatar: "/images/seller.jpg",
      rating: 4.9,
      reviews: 124,
      address: "Beverly Hills, CA",
      phone: "+1 (310) 555-0199"
    },
    highlights: [
      "Carbon Ceramic Brakes (PCCB)",
      "Weissach Performance Package",
      "Alcantara Race-tex Racing Bucket Seats",
      "Front Axle Lift System",
      "Bespoke Sport Chrono Package",
      "Matrix LED Headlights with PDLS+"
    ],
    description: "The 2024 Porsche 911 GT3 RS is designed for maximum track performance."
  },
  { id: 6, brand: "Lamborghini", model: "Hurac\xE1n Tecnica", year: 2026, price: 285e3, stockQuantity: 3, color: "Black", imageUrl: "/images/vehicle-placeholder.svg", status: "available", condition: "new", fuelType: "Petrol", transmission: "Auto", bodyType: "Coupe", engine: "5.2L V10", horsepower: "631 hp", drivetrain: "RWD" },
  { id: 7, brand: "Bugatti", model: "Chiron", year: 2026, price: 3e6, stockQuantity: 1, color: "Black", imageUrl: "/images/vehicle-placeholder.svg", status: "available", condition: "new", fuelType: "Petrol", transmission: "Auto", bodyType: "Coupe", engine: "8.0L Quad-Turbo W16", horsepower: "1500 hp", drivetrain: "RWD" },
  { id: 8, brand: "Maserati", model: "MC20", year: 2026, price: 24e4, stockQuantity: 2, color: "Black", imageUrl: "/images/vehicle-placeholder.svg", status: "available", condition: "new", fuelType: "Petrol", transmission: "Auto", bodyType: "Coupe", engine: "3.0L Twin-Turbo V6", horsepower: "621 hp", drivetrain: "RWD" },
  { id: 9, brand: "Rolls-Royce", model: "Spectre", year: 2026, price: 45e4, stockQuantity: 2, color: "Black", imageUrl: "/images/vehicle-placeholder.svg", status: "available", condition: "new", fuelType: "Electric", transmission: "Auto", bodyType: "Coupe", engine: "Dual Electric Motors", horsepower: "577 hp", drivetrain: "RWD" },
  // Additional inventory for brand, body type, price and pagination demos.
  { "id": 10, "brand": "BMW", "model": "M3 Competition", "year": 2025, "price": 89e3, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0010", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 11, "brand": "BMW", "model": "M8 Competition", "year": 2026, "price": 145e3, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0011", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 12, "brand": "BMW", "model": "XM", "year": 2025, "price": 165e3, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0012", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 13, "brand": "Ferrari", "model": "Roma", "year": 2026, "price": 25e4, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0013", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 14, "brand": "Ferrari", "model": "SF90 Stradale", "year": 2025, "price": 53e4, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0014", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 15, "brand": "Ferrari", "model": "Purosangue", "year": 2026, "price": 42e4, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0015", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 16, "brand": "Porsche", "model": "911 Turbo S", "year": 2025, "price": 23e4, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0016", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 17, "brand": "Porsche", "model": "Taycan Turbo GT", "year": 2026, "price": 245e3, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Electric", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0017", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 18, "brand": "Audi", "model": "R8 V10 Performance", "year": 2025, "price": 21e4, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0018", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 19, "brand": "Audi", "model": "RS7 Sportback", "year": 2026, "price": 13e4, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0019", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 20, "brand": "Audi", "model": "RS Q8", "year": 2025, "price": 15e4, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0020", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 21, "brand": "Lamborghini", "model": "Revuelto", "year": 2026, "price": 61e4, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0021", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 22, "brand": "Lamborghini", "model": "Urus S", "year": 2025, "price": 25e4, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0022", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 23, "brand": "Lamborghini", "model": "Hurac\xE1n STO", "year": 2026, "price": 335e3, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0023", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 24, "brand": "Bugatti", "model": "Chiron Super Sport", "year": 2025, "price": 39e5, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0024", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 25, "brand": "Bugatti", "model": "Divo", "year": 2026, "price": 58e5, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0025", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 26, "brand": "Bugatti", "model": "W16 Mistral", "year": 2025, "price": 5e6, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Convertible", "listingId": "SR-0026", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 27, "brand": "Maserati", "model": "GranTurismo Trofeo", "year": 2026, "price": 195e3, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0027", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 28, "brand": "Maserati", "model": "Grecale Trofeo", "year": 2025, "price": 115e3, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0028", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 29, "brand": "Maserati", "model": "GranCabrio Trofeo", "year": 2026, "price": 205e3, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Convertible", "listingId": "SR-0029", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 30, "brand": "Rolls-Royce", "model": "Ghost", "year": 2025, "price": 355e3, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0030", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 31, "brand": "Rolls-Royce", "model": "Phantom", "year": 2026, "price": 51e4, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0031", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." },
  { "id": 32, "brand": "Rolls-Royce", "model": "Cullinan", "year": 2025, "price": 41e4, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0032", "description": "Xe m\u1EDBi trong b\u1ED9 s\u01B0u t\u1EADp showroom. Gi\xE1 v\xE0 s\u1ED1 l\u01B0\u1EE3ng l\xE0 d\u1EEF li\u1EC7u gi\u1EA3 l\u1EADp." }
];
var MOCK_VEHICLES_TOTAL = MOCK_VEHICLES.length;

// src/app/core/services/brand/brand.service.ts
import { Injectable as Injectable3 } from "@angular/core";
import { of as of3, throwError as throwError2 } from "rxjs";

// src/app/core/services/brand/brand.mock.ts
var MOCK_BRANDS = [
  { id: 1, name: "Lamborghini", origin: "Italy", listedVehicles: 245, status: "active" },
  { id: 2, name: "Ferrari", origin: "Italy", listedVehicles: 198, status: "active" },
  { id: 3, name: "Audi", origin: "Germany", listedVehicles: 154, status: "active" },
  { id: 4, name: "Porsche", origin: "Germany", listedVehicles: 182, status: "active" },
  { id: 5, name: "BMW", origin: "Germany", listedVehicles: 110, status: "active" },
  { id: 6, name: "Bugatti", origin: "France", listedVehicles: 85, status: "active" },
  { id: 7, name: "Maserati", origin: "Italy", listedVehicles: 94, status: "active" },
  { id: 8, name: "Rolls-Royce", origin: "United Kingdom", listedVehicles: 72, status: "active" }
  // { id: 9, name: 'McLaren', origin: 'Germany', listedVehicles: 72, status: 'active' },
  // { id: 10, name: 'Lexus', origin: 'Germany', listedVehicles: 72, status: 'active' },
  // { id: 11, name: 'Bentley', origin: 'Germany', listedVehicles: 72, status: 'active' }
];

// src/app/core/services/brand/brand.service.ts
var BrandService = class {
  brands = MOCK_BRANDS.map((b) => ({ ...b, listedVehicles: MOCK_VEHICLES.filter((vehicle) => vehicle.brand === b.name).length }));
  getSnapshot() {
    return this.brands.map((brand) => ({ ...brand }));
  }
  syncVehicleCounts(vehicles2) {
    this.brands = this.brands.map((brand) => ({ ...brand, listedVehicles: vehicles2.filter((vehicle) => vehicle.brand === brand.name).length }));
  }
  getList(query) {
    let result = [...this.brands];
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(
        (b) => b.name.toLowerCase().includes(search) || b.origin.toLowerCase().includes(search)
      );
    }
    if (query.region && query.region !== "all") {
      result = result.filter((b) => b.origin === query.region);
    }
    const total = result.length;
    const start = (query.page - 1) * query.pageSize;
    const items = result.slice(start, start + query.pageSize);
    return of3({
      items,
      total,
      page: query.page,
      pageSize: query.pageSize
    });
  }
  create(brand) {
    const newBrand = {
      ...brand,
      id: Math.max(0, ...this.brands.map((b) => b.id)) + 1
    };
    this.brands = [...this.brands, newBrand];
    return of3(newBrand);
  }
  update(id, changes) {
    const index = this.brands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Kh\xF4ng t\xECm th\u1EA5y d\u1EEF li\u1EC7u");
    }
    if (changes.name && changes.name !== this.brands[index].name && this.brands[index].listedVehicles > 0) return throwError2(() => new Error("Th\u01B0\u01A1ng hi\u1EC7u \u0111ang c\xF3 xe, kh\xF4ng th\u1EC3 \u0111\u1ED5i t\xEAn."));
    const updated = { ...this.brands[index], ...changes };
    this.brands = this.brands.map((b) => b.id === id ? updated : b);
    return of3(updated);
  }
  delete(id) {
    if (this.brands.find((brand) => brand.id === id)?.listedVehicles) return throwError2(() => new Error("Th\u01B0\u01A1ng hi\u1EC7u \u0111ang c\xF3 xe, kh\xF4ng th\u1EC3 xo\xE1."));
    this.brands = this.brands.filter((b) => b.id !== id);
    return of3(void 0);
  }
};
BrandService = __decorateClass([
  Injectable3({ providedIn: "root" })
], BrandService);

// src/app/core/mock/mock-vehicle.store.ts
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable as Injectable4, inject as inject2 } from "@angular/core";
import { of as of4 } from "rxjs";
var MockVehicleStore = class {
  brands = inject2(BrandService);
  bookingVehicles = /* @__PURE__ */ new Set();
  getSnapshot() {
    return this.vehicles.map((vehicle) => ({ ...vehicle }));
  }
  retainForBooking(id) {
    this.bookingVehicles.add(id);
  }
  vehicles = MOCK_VEHICLES.map((v) => ({ ...v }));
  getList(query) {
    let result = [
      ...this.vehicles
    ];
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter((vehicle) => {
        const values = [
          vehicle.brand,
          vehicle.model,
          vehicle.color,
          vehicle.bodyType ?? "",
          vehicle.fuelType ?? "",
          vehicle.transmission ?? "",
          String(vehicle.year)
        ];
        return values.some(
          (value) => value.toLowerCase().includes(search)
        );
      });
    }
    if (query.brand && query.brand !== "all") {
      result = result.filter(
        (vehicle) => vehicle.brand === query.brand
      );
    }
    if (query.status && query.status !== "all") {
      result = result.filter(
        (vehicle) => vehicle.status === query.status
      );
    }
    if (query.condition && query.condition !== "all") {
      result = result.filter(
        (vehicle) => vehicle.condition === query.condition
      );
    }
    if (query.year && query.year !== "all") {
      result = result.filter(
        (vehicle) => String(vehicle.year) === query.year
      );
    }
    if (query.minYear !== void 0) {
      result = result.filter(
        (vehicle) => vehicle.year >= query.minYear
      );
    }
    if (query.maxYear !== void 0) {
      result = result.filter(
        (vehicle) => vehicle.year <= query.maxYear
      );
    }
    if (query.minPrice !== void 0) {
      result = result.filter(
        (vehicle) => vehicle.price >= query.minPrice
      );
    }
    if (query.maxPrice !== void 0) {
      result = result.filter(
        (vehicle) => vehicle.price <= query.maxPrice
      );
    }
    if (query.bodyTypes && query.bodyTypes.length > 0) {
      result = result.filter(
        (vehicle) => vehicle.bodyType ? query.bodyTypes.includes(
          vehicle.bodyType
        ) : false
      );
    }
    switch (query.sort) {
      case "price-asc":
        result.sort(
          (a, b) => a.price - b.price
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => b.price - a.price
        );
        break;
      case "year-desc":
        result.sort(
          (a, b) => b.year - a.year
        );
        break;
      default:
        result.sort(
          (a, b) => b.id - a.id
        );
    }
    const total = result.length;
    const start = (query.page - 1) * query.pageSize;
    const items = result.slice(
      start,
      start + query.pageSize
    );
    return of4({
      items,
      total,
      page: query.page,
      pageSize: query.pageSize
    });
  }
  create(vehicle) {
    this.validateInventory(vehicle.stockQuantity);
    this.validateBrand(vehicle.brand);
    const newVehicle = {
      ...vehicle,
      condition: "new",
      id: Math.max(0, ...this.vehicles.map((v) => v.id)) + 1
    };
    this.vehicles = [...this.vehicles, newVehicle];
    this.brands.syncVehicleCounts(this.vehicles);
    return of4(newVehicle);
  }
  update(id, changes) {
    this.validateInventory(changes.stockQuantity);
    this.validateBrand(changes.brand);
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new HttpErrorResponse({ status: 404, error: { message: "Kh\xF4ng t\xECm th\u1EA5y xe." } });
    }
    const updated = { ...this.vehicles[index], ...changes, condition: "new", id };
    this.vehicles = this.vehicles.map((v) => v.id === id ? updated : v);
    this.brands.syncVehicleCounts(this.vehicles);
    return of4(updated);
  }
  delete(id) {
    if (this.bookingVehicles.has(id)) throw new HttpErrorResponse({ status: 409, error: { message: "Xe \u0111\xE3 c\xF3 l\u1ECBch l\xE1i th\u1EED, kh\xF4ng th\u1EC3 xo\xE1." } });
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    this.brands.syncVehicleCounts(this.vehicles);
    return of4(void 0);
  }
  getById(id) {
    const vehicle = this.vehicles.find(
      (vehicle2) => vehicle2.id === id
    );
    return of4(vehicle);
  }
  getFeatured(limit = 4) {
    const vehicles2 = this.vehicles.filter(
      (vehicle) => vehicle.featured
    ).slice(
      0,
      limit
    );
    return of4(vehicles2);
  }
  getByIds(ids) {
    const vehicles2 = this.vehicles.filter(
      (vehicle) => ids.includes(vehicle.id)
    );
    return of4(vehicles2);
  }
  validateInventory(quantity) {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      throw new HttpErrorResponse({ status: 400, error: { message: "S\u1ED1 l\u01B0\u1EE3ng t\u1ED3n kho ph\u1EA3i l\xE0 s\u1ED1 nguy\xEAn kh\xF4ng \xE2m." } });
    }
  }
  validateBrand(name) {
    if (!this.brands.getSnapshot().some((brand) => brand.name === name)) {
      throw new HttpErrorResponse({ status: 400, error: { message: "Vui l\xF2ng ch\u1ECDn th\u01B0\u01A1ng hi\u1EC7u c\xF3 trong showroom." } });
    }
  }
};
MockVehicleStore = __decorateClass([
  Injectable4({ providedIn: "root" })
], MockVehicleStore);

// src/app/core/mock/mock-auth.store.ts
import { Injectable as Injectable5, inject as inject3 } from "@angular/core";
import { HttpErrorResponse as HttpErrorResponse2 } from "@angular/common/http";
var MockAuthStore = class {
  users = inject3(UserService);
  sessions = this.read("mock_sessions", []);
  constructor() {
    for (const account of this.read("mock_accounts", [])) {
      if (account.user.email.toLowerCase() === MOCK_ADMIN_CREDENTIALS.email) continue;
      const profile = this.users.getSnapshot().find((user) => user.email.toLowerCase() === account.user.email.toLowerCase());
      if (profile) {
        this.users.update(profile.id, { password: account.password }).subscribe();
      } else {
        this.users.create({
          fullName: account.user.fullName,
          email: account.user.email,
          password: account.password,
          phone: "",
          registeredAt: (/* @__PURE__ */ new Date()).toISOString(),
          role: "user",
          status: "active"
        }).subscribe();
      }
    }
    localStorage.removeItem("mock_accounts");
  }
  read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
    } catch {
      return fallback;
    }
  }
  emailAvailable(email) {
    return !this.users.getSnapshot().some((user) => user.email.toLowerCase() === email.trim().toLowerCase());
  }
  login(payload) {
    const profile = this.users.authenticate(payload.email, payload.password);
    if (!profile) throw new HttpErrorResponse2({ status: 401, error: { message: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng." } });
    if (profile.status !== "active") throw new HttpErrorResponse2({ status: 403, error: { message: "T\xE0i kho\u1EA3n ch\u01B0a ho\u1EA1t \u0111\u1ED9ng ho\u1EB7c \u0111\xE3 b\u1ECB kho\xE1." } });
    const user = this.authUser(profile);
    const token = `mock-${crypto.randomUUID()}`;
    this.sessions = this.sessions.filter((session) => session.expiresAt > Date.now());
    this.sessions.push({ token, user, expiresAt: Date.now() + 30 * 60 * 1e3, credentialVersion: this.users.credentialVersion(profile.id) });
    localStorage.setItem("mock_sessions", JSON.stringify(this.sessions));
    return { accessToken: token, user };
  }
  register(payload) {
    if (!this.emailAvailable(payload.email)) throw new HttpErrorResponse2({ status: 409, error: { message: "Email \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng." } });
    if (!payload.fullName.trim() || payload.password.length < 6) throw new HttpErrorResponse2({ status: 400, error: { message: "Th\xF4ng tin \u0111\u0103ng k\xFD kh\xF4ng h\u1EE3p l\u1EC7." } });
    let createError;
    this.users.create({
      fullName: payload.fullName.trim(),
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      registeredAt: (/* @__PURE__ */ new Date()).toISOString(),
      role: "user",
      status: "active"
    }).subscribe({ error: (error) => createError = error });
    if (createError) throw createError;
    return this.login(payload);
  }
  sessionUser(token) {
    const session = this.sessions.find((session2) => session2.token === token && session2.expiresAt > Date.now());
    if (!session) return null;
    const profile = this.users.getSnapshot().find((user) => user.id === session.user.id);
    if (!profile || profile.email !== session.user.email || profile.status !== "active" || this.users.credentialVersion(profile.id) !== (session.credentialVersion ?? 0)) return null;
    return this.authUser(profile);
  }
  isAdminToken(header) {
    return !!header?.startsWith("Bearer ") && isSoleAdmin(this.sessionUser(header.slice(7)));
  }
  revokeSession(token) {
    this.sessions = this.sessions.filter((session) => session.token !== token);
    localStorage.setItem("mock_sessions", JSON.stringify(this.sessions));
  }
  authUser(profile) {
    return {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      role: isSoleAdmin(profile) ? "admin" : "user",
      ...profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}
    };
  }
};
MockAuthStore = __decorateClass([
  Injectable5({ providedIn: "root" })
], MockAuthStore);

// src/app/core/services/test-drive/test-drive.service.ts
import { Injectable as Injectable6, inject as inject4 } from "@angular/core";
import { defer as defer2, of as of5 } from "rxjs";

// src/app/core/services/test-drive/test-drive.mock.ts
var customers = MOCK_USERS.filter((user) => user.role === "user" && user.status === "active");
var sellers = MOCK_SELLERS.filter((seller) => seller.status === "verified");
var slots = ["09:00 AM", "10:30 AM", "02:30 PM", "04:00 PM"];
var statuses = ["pending", "confirmed", "completed", "cancelled"];
var MOCK_TEST_DRIVES = Array.from({ length: 48 }, (_, index) => {
  const customer = customers[index % customers.length];
  const vehicle = MOCK_VEHICLES[index % MOCK_VEHICLES.length];
  const seller = sellers[index % sellers.length];
  const status = statuses[index % statuses.length];
  const historical = status === "completed" || status === "cancelled";
  const day = String(1 + Math.floor(index / slots.length)).padStart(2, "0");
  return {
    id: `TD-${8402 + index}`,
    customerId: customer.id,
    vehicleId: vehicle.id,
    sellerId: seller.id,
    customerName: customer.fullName,
    customerAvatarUrl: customer.avatarUrl,
    sellerName: seller.fullName,
    vehicleName: `${vehicle.brand} ${vehicle.model}`,
    vehicleImageUrl: vehicle.imageUrl,
    preferredDate: `2026-${historical ? "10" : "11"}-${day}`,
    timeSlot: slots[index % slots.length],
    location: "Showroom",
    status
  };
});
var MOCK_TEST_DRIVES_TOTAL = MOCK_TEST_DRIVES.length;
var MOCK_TEST_DRIVE_STATS = {
  totalBookings: MOCK_TEST_DRIVES.length,
  totalBookingsGrowth: 0,
  pending: MOCK_TEST_DRIVES.filter((booking) => booking.status === "pending").length,
  pendingGrowth: 0,
  confirmed: MOCK_TEST_DRIVES.filter((booking) => booking.status === "confirmed").length,
  confirmedGrowth: 0,
  completed: MOCK_TEST_DRIVES.filter((booking) => booking.status === "completed").length,
  completedGrowth: 0
};

// src/app/core/services/test-drive/test-drive.service.ts
var TestDriveService = class {
  users = inject4(UserService);
  sellers = inject4(SellerService);
  vehicles = inject4(MockVehicleStore);
  bookings = MOCK_TEST_DRIVES.map((booking) => ({ ...booking }));
  constructor() {
    this.bookings.forEach((booking) => this.retain(booking));
  }
  getOptions(existing) {
    return {
      customers: this.users.getSnapshot().filter((user) => user.role === "user" && (user.status === "active" || user.id === existing?.customerId)),
      sellers: this.sellers.getSnapshot().filter((seller) => seller.status === "verified" || seller.id === existing?.sellerId),
      vehicles: this.vehicles.getSnapshot().filter((vehicle) => vehicle.stockQuantity > 0 && vehicle.status === "available" || vehicle.id === existing?.vehicleId)
    };
  }
  hydrate(booking) {
    const customer = this.users.getSnapshot().find((user) => user.id === booking.customerId);
    const seller = this.sellers.getSnapshot().find((seller2) => seller2.id === booking.sellerId);
    const vehicle = this.vehicles.getSnapshot().find((vehicle2) => vehicle2.id === booking.vehicleId);
    return {
      ...booking,
      customerName: customer?.fullName ?? booking.customerName,
      sellerName: seller?.fullName ?? booking.sellerName,
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : booking.vehicleName,
      vehicleImageUrl: vehicle?.imageUrl ?? booking.vehicleImageUrl
    };
  }
  getList(query) {
    const all = this.bookings.map((booking) => this.hydrate(booking));
    const search = query.search?.trim().toLowerCase();
    const result = all.filter((booking) => (!search || [booking.id, booking.customerName, booking.vehicleName, booking.sellerName].some((value) => value.toLowerCase().includes(search))) && (!query.date || booking.preferredDate === query.date) && (!query.status || query.status === "all" || booking.status === query.status) && (query.customerId === void 0 || booking.customerId === query.customerId));
    const start = (query.page - 1) * query.pageSize;
    return of5({
      items: result.slice(start, start + query.pageSize),
      total: result.length,
      page: query.page,
      pageSize: query.pageSize,
      stats: {
        ...MOCK_TEST_DRIVE_STATS,
        totalBookings: all.length,
        pending: all.filter((b) => b.status === "pending").length,
        confirmed: all.filter((b) => b.status === "confirmed").length,
        completed: all.filter((b) => b.status === "completed").length
      }
    });
  }
  create(input2) {
    return defer2(() => {
      const booking = this.resolve(input2, `TD-${Math.max(8400, ...this.bookings.map((b) => Number(b.id.slice(3)))) + 1}`);
      this.bookings = [...this.bookings, booking];
      this.retain(booking);
      return of5(this.hydrate(booking));
    });
  }
  update(id, changes) {
    return defer2(() => {
      const current = this.bookings.find((booking2) => booking2.id === id);
      if (!current) throw new Error("Kh\xF4ng t\xECm th\u1EA5y l\u1ECBch l\xE1i th\u1EED.");
      const booking = this.resolve({ ...current, ...changes }, id);
      this.bookings = this.bookings.map((item) => item.id === id ? booking : item);
      this.retain(booking);
      return of5(this.hydrate(booking));
    });
  }
  delete(id) {
    return defer2(() => {
      const booking = this.bookings.find((booking2) => booking2.id === id);
      if (!booking) throw new Error("Kh\xF4ng t\xECm th\u1EA5y l\u1ECBch l\xE1i th\u1EED.");
      if (booking.status === "completed") throw new Error("Kh\xF4ng th\u1EC3 hu\u1EF7 l\u1ECBch \u0111\xE3 ho\xE0n th\xE0nh.");
      this.bookings = this.bookings.map((item) => item.id === id ? { ...item, status: "cancelled" } : item);
      return of5(void 0);
    });
  }
  resolve(input2, id) {
    const customer = this.users.getSnapshot().find((user) => user.id === input2.customerId && user.role === "user");
    const seller = this.sellers.getSnapshot().find((seller2) => seller2.id === input2.sellerId);
    const vehicle = this.vehicles.getSnapshot().find((vehicle2) => vehicle2.id === input2.vehicleId);
    if (!customer || !seller || !vehicle) throw new Error("Kh\xE1ch h\xE0ng, seller v\xE0 xe ph\u1EA3i t\u1ED3n t\u1EA1i trong d\u1EEF li\u1EC7u showroom.");
    if (!["pending", "confirmed", "completed", "cancelled"].includes(input2.status)) throw new Error("Tr\u1EA1ng th\xE1i l\u1ECBch kh\xF4ng h\u1EE3p l\u1EC7.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input2.preferredDate) || !Number.isFinite(Date.parse(input2.preferredDate)) || !input2.timeSlot.trim() || !input2.location.trim()) throw new Error("Vui l\xF2ng nh\u1EADp \u0111\u1EE7 ng\xE0y, gi\u1EDD v\xE0 \u0111\u1ECBa \u0111i\u1EC3m h\u1EE3p l\u1EC7.");
    const active = input2.status === "pending" || input2.status === "confirmed";
    if (active && (customer.status !== "active" || seller.status !== "verified" || vehicle.stockQuantity <= 0 || vehicle.status !== "available")) throw new Error("Kh\xE1ch h\xE0ng v\xE0 seller ph\u1EA3i ho\u1EA1t \u0111\u1ED9ng; xe ph\u1EA3i c\xF2n h\xE0ng v\xE0 s\u1EB5n s\xE0ng l\xE1i th\u1EED.");
    if (active && this.bookings.some((b) => b.id !== id && ["pending", "confirmed"].includes(b.status) && b.preferredDate === input2.preferredDate && b.timeSlot === input2.timeSlot && (b.sellerId === seller.id || b.customerId === customer.id))) throw new Error("Kh\xE1ch h\xE0ng ho\u1EB7c seller \u0111\xE3 c\xF3 l\u1ECBch trong khung gi\u1EDD n\xE0y.");
    return {
      ...input2,
      id,
      customerName: customer.fullName,
      sellerName: seller.fullName,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      vehicleImageUrl: vehicle.imageUrl
    };
  }
  retain(booking) {
    this.users.retainForBooking(booking.customerId);
    this.users.retainForBooking(booking.sellerId);
    this.vehicles.retainForBooking(booking.vehicleId);
  }
};
TestDriveService = __decorateClass([
  Injectable6({ providedIn: "root" })
], TestDriveService);

// .angular/showroom-check.ts
var storage = /* @__PURE__ */ new Map();
Object.defineProperty(globalThis, "localStorage", { value: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) } });
var injector = Injector.create({ providers: [UserService, SellerService, BrandService, MockVehicleStore, MockAuthStore, TestDriveService] });
var users = injector.get(UserService);
var sellers2 = injector.get(SellerService);
var brands = injector.get(BrandService);
var vehicles = injector.get(MockVehicleStore);
var drives = injector.get(TestDriveService);
var auth = injector.get(MockAuthStore);
assert.equal(brands.getSnapshot().length, 8);
assert.equal(users.getSnapshot().length, 34);
assert.equal(sellers2.getSnapshot().length, 10);
assert.ok(brands.getSnapshot().every((brand) => vehicles.getSnapshot().filter((vehicle) => vehicle.brand === brand.name).length === 4));
assert.equal(vehicles.getSnapshot().length, 32);
assert.ok(brands.getSnapshot().every((brand) => vehicles.getSnapshot().some((vehicle) => vehicle.brand === brand.name)));
assert.ok(vehicles.getSnapshot().every((vehicle) => brands.getSnapshot().some((brand) => brand.name === vehicle.brand)));
assert.ok(sellers2.getSnapshot().every((seller) => users.getSnapshot().some((user) => user.id === seller.userId && user.role === "seller")));
var seeded = await firstValueFrom(drives.getList({ page: 1, pageSize: 100 }));
assert.ok(seeded.items.every((booking) => users.getSnapshot().some((user) => user.id === booking.customerId) && sellers2.getSnapshot().some((seller) => seller.id === booking.sellerId) && vehicles.getSnapshot().some((vehicle) => vehicle.id === booking.vehicleId)));
assert.equal(seeded.items.length, 48);
for (const booking of seeded.items.filter((booking2) => ["pending", "confirmed"].includes(booking2.status))) {
  assert.ok(!seeded.items.some((other) => other.id !== booking.id && ["pending", "confirmed"].includes(other.status) && other.preferredDate === booking.preferredDate && other.timeSlot === booking.timeSlot && (other.sellerId === booking.sellerId || other.customerId === booking.customerId)));
}
var input = { customerId: 6, vehicleId: 6, sellerId: 2, preferredDate: "2026-12-01", timeSlot: "09:00 AM", location: "Showroom", status: "pending" };
var created = await firstValueFrom(drives.create(input));
assert.equal(created.sellerName, "Michael Chang");
await assert.rejects(firstValueFrom(drives.create({ ...input, sellerId: 999 })));
await assert.rejects(firstValueFrom(drives.create(input)));
await assert.rejects(firstValueFrom(users.delete(6)));
await assert.rejects(firstValueFrom(users.update(2, { role: "user" })));
await firstValueFrom(users.update(6, { fullName: "Renamed customer" }));
assert.equal((await firstValueFrom(drives.getList({ customerId: 6, page: 1, pageSize: 100 }))).items.find((b) => b.id === created.id)?.customerName, "Renamed customer");
await firstValueFrom(drives.delete(created.id));
assert.ok((await firstValueFrom(drives.getList({ status: "cancelled", page: 1, pageSize: 100 }))).items.some((booking) => booking.id === created.id));
var registered = auth.register({ fullName: "New Customer", email: "newcustomer@example.com", password: "secret123", phone: "0901234567" });
assert.ok(users.getSnapshot().some((user) => user.id === registered.user.id && user.email === registered.user.email));
assert.throws(() => vehicles.create({ ...vehicles.getSnapshot()[0], brand: "Unknown" }));
console.log("PASS: brand coverage, relational seed data, booking creation/cancellation, invalid references, scheduling conflicts, deletion protection, live customer names, registration synchronization, brand validation.");
var sellerInput = { fullName: "New Seller", email: "newseller@example.com", phone: "0901234567", company: "New Showroom", status: "pending", joinDate: "2026-10-28" };
var newSeller = await firstValueFrom(sellers2.create(sellerInput));
assert.equal(newSeller.company, "New Showroom");
assert.ok(users.getSnapshot().some((user) => user.id === newSeller.userId && user.role === "seller" && user.status === "pending"));
var editedSeller = await firstValueFrom(sellers2.update(newSeller.id, { ...sellerInput, fullName: "Edited Seller", company: "Edited Showroom", status: "verified" }));
assert.equal(editedSeller.company, "Edited Showroom");
assert.equal(users.getSnapshot().find((user) => user.id === newSeller.userId)?.fullName, "Edited Seller");
assert.equal(users.getSnapshot().find((user) => user.id === newSeller.userId)?.status, "active");
await assert.rejects(firstValueFrom(sellers2.create({ ...sellerInput, email: "admin@giakiet.com" })));
await assert.rejects(firstValueFrom(sellers2.delete(2)));
await firstValueFrom(sellers2.delete(newSeller.id));
assert.ok(!sellers2.getSnapshot().some((seller) => seller.id === newSeller.id));
assert.ok(!users.getSnapshot().some((user) => user.id === newSeller.userId));
console.log("PASS: seller create/update/delete, company data, User synchronization, duplicate email rejection and booking-reference protection.");
var managed = await firstValueFrom(users.create({ fullName: "Managed Website User", email: "managed@example.com", phone: "0901234567", registeredAt: "", role: "user", status: "active", password: "initial123" }));
assert.ok(!("password" in managed));
var managedSession = auth.login({ email: " MANAGED@example.com ", password: "initial123" });
assert.equal(managedSession.user.id, managed.id);
assert.equal(managedSession.user.role, "user");
assert.throws(() => auth.login({ email: "managed@example.com", password: "incorrect" }));
await firstValueFrom(users.update(managed.id, { password: "", fullName: "Edited Website User" }));
assert.equal(auth.login({ email: "managed@example.com", password: "initial123" }).user.fullName, "Edited Website User");
await firstValueFrom(users.update(managed.id, { password: "changed123" }));
assert.equal(auth.sessionUser(managedSession.accessToken), null);
assert.throws(() => auth.login({ email: "managed@example.com", password: "initial123" }));
var changedSession = auth.login({ email: "managed@example.com", password: "changed123" });
assert.equal(changedSession.user.id, managed.id);
var reloadedUsers = new UserService();
assert.equal(reloadedUsers.authenticate("managed@example.com", "changed123")?.id, managed.id);
await firstValueFrom(users.update(managed.id, { email: "edited@example.com" }));
assert.throws(() => auth.login({ email: "managed@example.com", password: "changed123" }));
assert.equal(auth.login({ email: "edited@example.com", password: "changed123" }).user.id, managed.id);
await firstValueFrom(users.update(managed.id, { status: "blocked" }));
assert.throws(() => auth.login({ email: "edited@example.com", password: "changed123" }));
assert.equal(auth.sessionUser(changedSession.accessToken), null);
await firstValueFrom(users.delete(managed.id));
assert.throws(() => auth.login({ email: "edited@example.com", password: "changed123" }));
assert.equal(users.getSnapshot().filter((user) => user.role === "admin").length, 1);
console.log("PASS: admin-managed passwords, correct/incorrect login, blank edit, password reset, session invalidation, reload persistence, email updates, blocked/deleted accounts, single admin policy.");
