> Hướng dẫn chung và lệnh chạy User: [testing/README.md](../README.md).

# Kiểm thử nâng cao cho khu vực admin

Bộ test nâng cao kiểm tra **đăng nhập admin**, **Vehicles**, **Users**, **Test Drives**,
**Brands** và **Sellers**,
gồm cả thao tác thành công và xử lý lỗi.
Các spec có sẵn trong `src/` vẫn giữ nguyên, chạy riêng nếu cần.

## Tách biệt với đồ án

- Test, cấu hình và dependency riêng nằm trong `testing/`; workflow nằm trong `.github/workflows/advanced-testing.yml`.
- Không cần cài phần này để chạy, build hay trình bày ứng dụng. Các lệnh gốc `npm start`, `npm run build`, `npm test` giữ nguyên.
- Test không được nhập vào bundle ứng dụng và không sửa code chức năng.
- CI chạy thủ công, không tự chặn push/PR hay build/deploy.
- Sử dụng mock API hiện có của ứng dụng, không kết nối backend thật. Mỗi E2E có browser context riêng; không dùng dữ liệu trong trình duyệt cá nhân.

## Cài đặt

Tại thư mục gốc `FE-Showroom`, dùng Node.js 22 và npm:

```bash
npm ci
npm ci --prefix testing
cd testing
npx playwright install chromium
cd ..
```

Nếu Linux thiếu thư viện cho Chromium, chạy `npx playwright install --with-deps chromium`
trong `testing/` (có thể cần sudo). Unit runner cũng dùng Chromium này; có thể đặt
`CHROME_BIN` để dùng một Chrome có sẵn.

## Chạy và xem trình duyệt tự thao tác

Tất cả lệnh dưới đây chạy ở thư mục gốc:

```bash
# Xem trình duyệt tự chạy, chậm 350ms mỗi thao tác để dễ theo dõi
npm --prefix testing run test:e2e:demo:admin

# E2E không mở cửa sổ trình duyệt
npm --prefix testing run test:e2e:admin

# Giao diện Playwright: chọn test, nhấn Run, xem từng step
npm --prefix testing run test:e2e:ui

# Debug từng bước (nhấn Resume/Step over nếu đang dừng ở about:blank)
npm --prefix testing run test:e2e -- --debug

# Unit/integration bằng TestBed, xuất coverage
npm --prefix testing run test:unit:admin

# Unit/integration trước, rồi toàn bộ E2E
npm --prefix testing run test:admin

# Xem báo cáo HTML của lần chạy E2E gần nhất
npm --prefix testing run report
```

Playwright tự khởi động/dừng server riêng tại `http://127.0.0.1:4300`.
Không cần chạy `npm start`; cổng 4300 phải trống. Để chỉnh tốc độ demo trên Linux:
`E2E_SLOW_MO=700 npm --prefix testing run test:e2e:demo`.

## Thứ tự E2E

1. Project **admin-login** chạy file `admin/e2e/01-admin-login.spec.ts`.
2. Chỉ khi đăng nhập đã được kiểm tra thành công, project **admin-vehicles** chạy
   file `admin/e2e/02-admin-vehicles.spec.ts`.
3. Project **admin-users** chạy `admin/e2e/03-admin-users.spec.ts` sau Vehicles.
4. Project **admin-test-drives** chạy `admin/e2e/04-admin-test-drives.spec.ts` sau Users.
5. Project **admin-brands** chạy `admin/e2e/05-admin-brands.spec.ts` sau Test Drives.
6. Project **admin-sellers** chạy `admin/e2e/06-admin-sellers.spec.ts` sau Brands.
7. Test chạy lần lượt bằng một worker. Mỗi test đăng nhập qua form thật
   trong context mới, không phụ thuộc dữ liệu của test trước. Không dùng chung
   phiên hay thứ tự CRUD giữa các test độc lập.

Chạy riêng từng phần:

```bash
npm --prefix testing run test:e2e -- --project=admin-login
# Mặc định vẫn chạy project đăng nhập làm điều kiện trước Vehicles
npm --prefix testing run test:e2e -- --project=admin-vehicles
# Chạy riêng Users hoặc Test Drives, bỏ các project phụ thuộc phía trước.
# Mỗi test vẫn tự đăng nhập qua form, không cần phiên chạy trước đó.
npm --prefix testing run test:e2e -- --project=admin-users --no-deps
npm --prefix testing run test:e2e -- --project=admin-test-drives --no-deps
# Xem trình duyệt tự chạy riêng từng nhóm
npm --prefix testing run test:e2e:demo -- --project=admin-users --no-deps
npm --prefix testing run test:e2e:demo -- --project=admin-test-drives --no-deps
# Chạy riêng Brands và Sellers
npm --prefix testing run test:e2e -- --project=admin-brands --no-deps
npm --prefix testing run test:e2e -- --project=admin-sellers --no-deps
npm --prefix testing run test:e2e:demo -- --project=admin-brands --no-deps
npm --prefix testing run test:e2e:demo -- --project=admin-sellers --no-deps
```

Trong UI Mode, chọn các project muốn quan sát và nhấn Run. Có thể chạy một test
riêng vì từng test tự đăng nhập, tạo dữ liệu và không dùng browser context của test khác.

## Các trường hợp được kiểm tra

| Nhóm | Tình huống | Kết quả mong đợi |
| --- | --- | --- |
| Đăng nhập | Truy cập Vehicles khi chưa đăng nhập | Chuyển về loginadmin và giữ redirectTo |
| Đăng nhập | Form trống, email sai, mật khẩu ngắn | Hiện validation, không đăng nhập |
| Đăng nhập | Sai mật khẩu rồi nhập lại đúng | Hiện lỗi, sau đó mở được Vehicles |
| Đăng nhập | Tài khoản không có quyền admin | Báo không có quyền, không giữ phiên |
| Đăng nhập | Admin hợp lệ | Mở được danh sách và nút Add New Vehicle |
| Thêm | Dữ liệu hợp lệ | Xe xuất hiện với đúng brand/model/year/price/stock/color/status |
| Sửa | Đổi các trường của xe vừa thêm | Bảng và form khi mở lại có dữ liệu mới |
| Xóa | Hủy xác nhận / đồng ý xác nhận | Xe còn nguyên / xe biến mất và không tìm lại được |
| Tìm kiếm | Model, chữ hoa/thường, khoảng trắng, không khớp | Đúng tập kết quả hoặc danh sách rỗng |
| Brand | BMW / Audi / All | Đúng các xe thuộc brand đã chọn |
| Status | available / reserved / sold / draft / All | Chỉ hiện xe đúng status |
| Year | 2024 / 2023 / All | Chỉ hiện xe đúng năm |
| Kết hợp | Search + brand + status + year | Điều kiện AND; kết hợp không khớp trả rỗng; reset trả lại danh sách |
| Validation | Model >60 ký tự, năm ngoài giới hạn, giá <=0, tồn kho âm/lẻ, URL sai | Không lưu, hiển thị lỗi, sửa đúng thì lưu được |
| Lỗi thêm/sửa | Brand không có trong showroom | Snackbar báo lỗi, modal và dữ liệu còn nguyên, có thể thử lại |
| Lỗi xóa | Xe có lịch lái thử (BMW M4 Competition có sẵn) | Báo không thể xóa, xe vẫn còn |
| Lỗi tải | Tìm `!error` để mô phỏng HTTP 500 | Báo lỗi máy chủ, hết loading, sau đó tìm kiếm bình thường được |
| Mất phiên | Xóa token trong context test trước khi lưu | Báo hết phiên và chuyển về đăng nhập |
| Users CRUD | Thêm → tìm → sửa → reload → khóa/mở khóa → hủy/xác nhận xóa | Dữ liệu đúng, lưu sau reload; hủy không thay đổi dữ liệu |
| Users filters | Tìm tên/email/phone, role user/seller/admin, status active/pending/blocked | Đúng toàn bộ email trong kết quả; điều kiện kết hợp AND; reset và không khớp |
| Users validation | Form trống, email sai, mật khẩu ngắn, tên quá dài | Không tạo, hiển thị validation |
| Users errors | Email trùng hoặc email admin khi thêm/sửa | Hiện lỗi, giữ form và bản ghi cũ, có thể sửa lại |
| Users protection | Admin cố định; khách đã có lịch lái thử | Không cho thao tác admin; lỗi khi xóa/khóa/đổi role khách đã liên kết |
| Users password | Đổi mật khẩu rồi đăng nhập website | Mật khẩu cũ bị từ chối, mật khẩu mới đăng nhập thành công; để trống khi sửa giữ mật khẩu cũ |
| Test Drives CRUD | Tạo → sửa ngày/giờ/địa điểm/status → reload → hủy | Đúng dữ liệu, giữ cancelled trong lịch sử và sau reload |
| Test Drives filters | Search ID/tên khách + ngày + 4 status | Kiểm tra toàn bộ ID, kết hợp AND, reset, danh sách rỗng và phân trang |
| Test Drives validation | Thiếu khách/xe/seller/ngày/giờ/địa điểm, reference sai, xe không sẵn sàng | Không tạo lịch sai; hiện lỗi |
| Test Drives conflicts | Khách hoặc seller đã có lịch cùng ngày/giờ, khi tạo và sửa | Giữ form và lịch cũ; đổi khung giờ thì lưu được |
| Test Drives history | Hủy xác nhận; lịch completed | Hủy xác nhận không đổi lịch; lịch completed không được hủy |
| Users ↔ Test Drives | Đổi tên khách đã có lịch | Tên trong lịch đồng bộ; vẫn ngăn xóa/khóa tài khoản liên quan |
| Brands CRUD | Thêm/sửa tên, xuất xứ, status; hủy/xác nhận xóa | Đúng dữ liệu và chỉ xóa khi xác nhận |
| Brands filters | Tìm tên/xuất xứ, lọc region, kết hợp AND và reset | Kiểm tra toàn bộ tên brand và tổng số, cả kết quả rỗng |
| Brands validation | Tên rỗng/quá 50 ký tự, số xe âm | Hiển thị validation và không lưu; hủy form không tạo brand |
| Brands ↔ Vehicles | Tạo/xóa xe của brand mới, đổi tên/xóa brand có xe | Đếm xe đồng bộ; brand có xe không đổi tên/xóa được; hết xe thì được |
| Sellers CRUD | Thêm/sửa/xóa seller và tài khoản User tương ứng | Tên/email/phone/status đồng bộ giữa hai màn hình; hủy xác nhận giữ dữ liệu |
| Sellers filters | Search tên/email/phone/company, lọc ngày và verified/pending/suspended | Đúng toàn bộ tập email, lọc AND, reset và phân trang |
| Sellers validation | Trường trống/whitespace, email/phone sai, tên/company quá dài, thiếu ngày | Không tạo/sửa sai, hiển thị validation |
| Sellers errors | Email trùng/reserved khi thêm/sửa | Báo lỗi, giữ form và dữ liệu cũ, sửa lại được |
| Sellers ↔ Test Drives | Xóa seller đã có lịch; đổi tên seller | Chặn xóa, hiện thông báo; tên seller trong lịch đồng bộ |
| Sellers persistence | Reload trang | Giữ thông tin tài khoản liên kết; company có giới hạn lưu trữ được nêu bên dưới |

Bộ lọc dùng 4 xe được tạo qua UI với model `PW FILTER A/B/C/D`, brand/năm/status
khác nhau. Test so sánh **toàn bộ tập model và tổng kết quả**, để phát hiện cả trường
hợp lọc thiếu xe lẫn lẫn xe không phù hợp. Không chỉ kiểm tra một dòng có xuất hiện.

## TestBed và service

- `admin/unit/admin-login.component.spec.ts`: validation, chuyển trang, quyền admin,
  lỗi request, thử lại và chặn gửi trùng.
- `admin/unit/admin-vehicles.component.spec.ts`: template thật, debounce, query bộ lọc,
  phân trang, validation, CRUD, hủy thao tác, chống lưu trùng và phục hồi sau lỗi.
  Dùng spy service để điều khiển thành công/thất bại của component.
- `admin/unit/admin-vehicles.service.spec.ts`: integration qua `TestBed` với `VehicleService`,
  `AuthService`, interceptors và mock API thật của ứng dụng; kiểm tra CRUD, lọc,
  phân trang, các mã lỗi 400/401/404/409/500 và dữ liệu không thay đổi sau request lỗi.
- `admin/unit/admin-users.component.spec.ts`: template và UserService thật qua TestBed;
  debounce, validation, CRUD, khóa/mở khóa, bảo vệ admin và lỗi thao tác.
- `admin/unit/admin-users.service.spec.ts`: tìm/lọc/phân trang, dữ liệu lưu sau reload,
  chuẩn hóa email, mật khẩu, vô hiệu phiên cũ, tài khoản bị khóa và liên kết booking.
- `admin/unit/admin-test-drives.component.spec.ts`: options hợp lệ, form, tìm/lọc/phân trang,
  tạo/sửa/hủy, chống submit trùng, thông báo lỗi và thử lại.
- `admin/unit/admin-test-drives.service.spec.ts`: CRUD và lịch sử, lọc và thống kê,
  reference/availability, trùng khách hoặc seller, lỗi storage và đồng bộ với Users.
- `admin/unit/admin-brands.component.spec.ts`: catalog, form, search/region, phân trang,
  CRUD, dữ liệu không đổi khi thao tác bị chặn và phục hồi sau lỗi request.
- `admin/unit/admin-brands.service.spec.ts`: snapshot, CRUD, search/region, phân trang,
  ràng buộc brand có xe và đồng bộ số xe qua MockVehicleStore.
- `admin/unit/admin-sellers.component.spec.ts`: validation, CRUD, bộ lọc, chặn lưu trùng,
  lỗi thao tác và tự quay về trang hợp lệ khi xóa dòng cuối trang cuối.
- `admin/unit/admin-sellers.service.spec.ts`: đồng bộ User, chuyển đổi ba trạng thái,
  validation/duplicate email, filters/stats, booking và thông tin tài khoản sau reload.

Coverage chỉ thuộc bộ TestBed này và code phụ thuộc được nạp, không cộng E2E.
Báo cáo có thể bao gồm service phụ trợ; không đại diện độ bao phủ toàn ứng dụng.

## Nếu chức năng sai thì sao?

- Khi kết quả thực tế khác mong đợi, test báo **FAIL**, chỉ rõ assertion/step lỗi;
  tiến trình trả exit code khác 0. CI cũng báo job thất bại.
- Khi cố tình nhập dữ liệu sai và ứng dụng xử lý đúng như mong đợi, test vẫn **PASS**.
  Ví dụ brand lạ phải hiện thông báo lỗi, giữ modal và không thêm xe.
- Khi chạy đầy đủ, nếu project phụ thuộc thất bại sau retry, các project phía sau bị
  **skipped** theo chuỗi login → vehicles → users → test-drives → brands → sellers. Các test độc lập trong
  cùng project vẫn tiếp tục chạy. Dùng `--no-deps` để chẩn đoán riêng một nhóm.
- Test phát hiện lỗi và xuất bằng chứng, không tự sửa code ứng dụng hay bỏ qua assertion.

Báo cáo và bằng chứng:

- `testing/reports/playwright/index.html`: kết quả từng test và các `test.step`.
- `testing/reports/e2e-junit.xml`: kết quả dạng JUnit cho CI.
- `testing/reports/results/`: screenshot, video và trace của test thất bại.
- `testing/reports/coverage/admin/index.html`: coverage của TestBed, kèm `lcov.info`.
- Xem trace: chạy `npx playwright show-trace <duong-dan-trace.zip>` trong `testing/`.

Đây là kiểm thử frontend với mock, chưa xác minh backend hay database thực.
Vehicles hiện lưu trong bộ nhớ: reload trang khởi tạo lại dữ liệu xe. Test CRUD
kiểm tra trong cùng phiên ứng dụng, không tuyên bố dữ liệu xe tồn tại sau reload.
Users và Test Drives lưu trong localStorage của context test; có kiểm tra khôi phục
sau reload. Bộ test không chia sẻ dữ liệu tạo ở project Vehicles sang các project khác.

### Giới hạn hiện tại được ghi nhận khi viết test Brands/Sellers

- Brands lưu trong bộ nhớ, chưa lưu brand mới sau reload. Các test liên kết xe/brand
  dùng menu Angular Router để giữ cùng phiên dữ liệu, không tải lại trang giữa chừng.
- Khi đổi tên/xóa brand có xe, BrandService trả lỗi cục bộ, component giữ form/bản
  ghi nhưng **chưa có thông báo lỗi trên giao diện**. Test xác minh dữ liệu được bảo vệ,
  không tuyên bố đã có snackbar. Muốn thêm thông báo cần thay đổi code chức năng riêng.
- Tên/email/phone/ngày/status Seller được lưu qua tài khoản User. Company nằm trong
  Map của SellerService, **trở về Showroom sau reload**; test chỉ xác minh company trong
  cùng phiên ứng dụng. Đây là giới hạn hiện tại, không phải đảm bảo lưu company lâu dài.
- Các test không sửa ứng dụng hoặc tắt kiểm tra lỗi để vượt qua những giới hạn này.

## CI tùy chọn

Đưa workflow lên nhánh mặc định của GitHub, mở **Actions → Advanced testing (optional)
→ Run workflow**. Workflow có hai job matrix admin/user độc lập. Mỗi job cài dependency bằng lockfile, cài Chromium cùng thư viện hệ thống,
chạy TestBed rồi E2E của nhóm tương ứng và tải artifact **advanced-testing-reports-admin** (giữ 7 ngày).
E2E vẫn chạy nếu bước TestBed lỗi để thu đủ kết quả; workflow vẫn báo thất bại.
CI cho phép một lần retry E2E và chỉ dùng một worker.

Không cần GitHub để chạy test trên máy. Bộ test cũ trong `src/` vẫn có thể chạy riêng:

```bash
npm --prefix testing run test:unit:legacy
```

## Tham khảo

- [Angular TestBed](https://angular.dev/api/core/testing/TestBed)
- [Playwright project dependencies](https://playwright.dev/docs/test-projects#dependencies)
- [Playwright debug](https://playwright.dev/docs/debug)
- [Playwright CI](https://playwright.dev/docs/ci)
