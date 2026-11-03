# Kiểm thử nâng cao — Admin và User tách riêng

Đây là phần mở rộng tùy chọn của đồ án: **Angular TestBed/Jasmine/Karma** cho unit và
integration test, **Playwright** cho E2E, **GitHub Actions** để chạy trong CI.
Không cần phần này để chạy/build/trình bày ứng dụng; dependency và lệnh gốc giữ nguyên.

## Cấu trúc

```text
testing/
  admin/
    unit/           # TestBed cho đăng nhập và các chức năng quản trị
    e2e/            # Playwright admin + helpers riêng
    README.md
  user/
    unit/           # TestBed component/service của trang khách hàng
    e2e/            # Playwright hành trình khách hàng + helpers riêng
    README.md
  scripts/          # Runner unit và demo dùng chung
  playwright.config.ts
  tsconfig.unit.json
  tsconfig.e2e.json
  reports/          # Kết quả sinh ra, không commit
```

Các spec sẵn có trong `src/` vẫn giữ nguyên, chạy bằng `test:unit:legacy`.
Test admin đã được **di chuyển**, không chạy thêm bản sao ở đường dẫn cũ.
Mỗi folder unit/e2e có tsconfig để IDE nhận đúng kiểu Jasmine/Playwright và rootDir.

## Cài đặt lần đầu

Chạy tại thư mục gốc **FE-Showroom**, dùng Node.js 22:

```bash
npm ci
npm ci --prefix testing
cd testing
npx playwright install chromium
cd ..
```

Trên Linux thiếu thư viện trình duyệt, chạy `npx playwright install --with-deps chromium`
trong `testing/` (có thể cần sudo). Unit runner mặc định dùng Chromium của Playwright;
đặt `CHROME_BIN` nếu muốn dùng Chrome có sẵn.

## Chạy riêng từng nhóm

Tất cả lệnh dưới đây chạy ở thư mục gốc repository:

| Mục đích | Admin | User |
| --- | --- | --- |
| Unit/integration | `npm --prefix testing run test:unit:admin` | `npm --prefix testing run test:unit:user` |
| E2E headless | `npm --prefix testing run test:e2e:admin` | `npm --prefix testing run test:e2e:user` |
| Xem trình duyệt tự chạy chậm | `npm --prefix testing run test:e2e:demo:admin` | `npm --prefix testing run test:e2e:demo:user` |
| Unit rồi E2E | `npm --prefix testing run test:admin` | `npm --prefix testing run test:user` |

```bash
# Toàn bộ unit + E2E của cả Admin lẫn User
npm --prefix testing test

# Hoặc chạy riêng toàn bộ unit / toàn bộ E2E
npm --prefix testing run test:unit
npm --prefix testing run test:e2e

# UI tương tác: chọn các project admin-* hoặc user-*, sau đó nhấn Run
npm --prefix testing run test:e2e:ui

# Báo cáo E2E gần nhất
npm --prefix testing run report

# Bộ test cũ trong src
npm --prefix testing run test:unit:legacy
```

E2E tự mở/dừng server tại `http://127.0.0.1:4300`; không cần `npm start` và cổng này
phải trống. Không chạy hai bộ E2E cùng lúc trên máy vì dùng chung server và nơi xuất báo cáo.
Demo mặc định chậm 350ms mỗi thao tác, có thể đổi trên Linux:

```bash
E2E_SLOW_MO=700 npm --prefix testing run test:e2e:demo:user
```

Khi dùng `--debug`, trình duyệt có thể dừng ở `about:blank` trước `page.goto`;
nhấn Resume/Step over trong Playwright Inspector để tiếp tục.

## Phạm vi

- **Admin**: đăng nhập → Vehicles → Users → Test Drives → Brands → Sellers.
  [Chi tiết ca kiểm thử và giới hạn hiện có](admin/README.md).
- **User**: đăng ký/đăng nhập/đăng xuất; catalog và chi tiết; lọc/sắp xếp/phân trang;
  yêu thích/so sánh; đặt và hủy lịch, tài khoản chỉ thấy lịch của mình; quên mật khẩu,
  validation hồ sơ và liên hệ. [Chi tiết](user/README.md).

Hai chuỗi project độc lập. User không cần đợi admin pass để chạy, và ngược lại.
Mỗi test dùng browser context mới, không chia sẻ dữ liệu hay phiên của người trình bày.
Test thao tác trên mock API/localStorage hiện có của ứng dụng; không xác minh backend thật.

## PASS/FAIL và báo cáo

- Kết quả thực tế khác mong đợi → **FAIL**, exit code khác 0 và bằng chứng trong report.
- Cố tình nhập sai nhưng ứng dụng từ chối đúng → **PASS**.
- Một project thất bại sau retry làm các project phụ thuộc của chính nhóm đó skipped.
  Dùng `--project=<ten-project> --no-deps` để chẩn đoán riêng.
- E2E HTML: `testing/reports/playwright/index.html`, JUnit: `testing/reports/e2e-junit.xml`.
- Screenshot/video/trace lỗi: `testing/reports/results/`.
- Coverage chạy cả hai nhóm: `testing/reports/coverage/index.html`.
- Coverage chạy riêng: `testing/reports/coverage/admin/index.html` hoặc
  `testing/reports/coverage/user/index.html`. Chạy riêng không cộng dồn coverage hai nhóm.
- E2E mỗi lần chạy ghi lại report gần nhất. Lệnh `report` mở report của lần chạy đó.
- Xem trace trong `testing/`: `npx playwright show-trace <duong-dan-trace.zip>`.

## CI tùy chọn

Workflow `.github/workflows/advanced-testing.yml` chỉ chạy thủ công:
**Actions → Advanced testing (optional) → Run workflow**.

Matrix tạo **hai job độc lập admin/user**, mỗi job chạy TestBed và E2E đúng nhóm.
Một job lỗi không hủy job kia (`fail-fast: false`). E2E vẫn được chạy sau lỗi unit để
có đủ kết quả, còn job vẫn báo thất bại. Mỗi job giới hạn 20 phút, cho phép một retry E2E.

Artifacts **advanced-testing-reports-admin** và **advanced-testing-reports-user**
giữ báo cáo và bằng chứng 7 ngày. Workflow không build/deploy hoặc chặn nộp đồ án.
Chưa có thao tác push hay kích hoạt GitHub Actions từ phiên làm việc này.
