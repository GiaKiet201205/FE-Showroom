# Kiểm thử trang User

Xem [hướng dẫn cài đặt/chạy chung](../README.md). Tất cả test khách hàng nằm trong
`testing/user/`, tách khỏi `testing/admin/`. Tên User ở đây chỉ trang khách hàng,
khác chức năng quản lý Users của admin.

## Chạy nhanh ở thư mục gốc

```bash
# Trình duyệt tự chạy chậm để xem thao tác
npm --prefix testing run test:e2e:demo:user

# Toàn bộ TestBed + E2E User
npm --prefix testing run test:user

# Chạy riêng
npm --prefix testing run test:unit:user
npm --prefix testing run test:e2e:user

# Chẩn đoán một project, bỏ dependency
npm --prefix testing run test:e2e -- --project=user-bookings --no-deps
```

## Unit/integration với TestBed

| File trong user/unit | Các hành vi kiểm tra |
| --- | --- |
| auth.component.spec.ts | Đăng ký form trống/sai, password xác nhận, điều khoản, debounce email-check, email trùng/lỗi request, chặn gửi khi pending, thử lại, submit trùng; đăng nhập validation/lỗi/thành công |
| auth.service.spec.ts | Register tạo User và đăng nhập, khôi phục phiên, logout thu hồi token, email trùng, password sai, tài khoản pending/blocked |
| catalog.component.spec.ts | Query URL, chỉ xe available, search/brand/price/year/bodyType/sort, reset, phân trang, empty state; chi tiết/ảnh/specs/yêu thích/đi tới đặt lịch |
| saved-cars.spec.ts | Favorites/compare đồng bộ, không trùng, localStorage hỏng, persistence và clear; highlight đúng giá/năm/hp, tính lại khi remove, lỗi tải và phục hồi |
| bookings.component.spec.ts | Guest disabled, prefill đúng tài khoản và xe từ query, validation, customerId lấy từ phiên, ngày quá khứ, trùng lịch, retry, submit trùng, lịch riêng tư, xác nhận hủy, tab cancelled/completed và thay đổi từ admin |
| forms.component.spec.ts | Profile validation/lưu bản ghi mock; contact validation/submit/reset/FAQ; forgot password validation/success/error |

## E2E bằng Playwright

| Project / file trong user/e2e | Hành trình |
| --- | --- |
| user-auth / 01-auth.spec.ts | Đăng ký → reload giữ phiên → logout → password sai → đăng nhập lại; validation, duplicate email và sửa lại, tài khoản bị khóa, không có quyền admin |
| user-catalog / 02-catalog.spec.ts | Lọc URL, tìm kiếm, brand, price, year, bodyType, AND, không khớp/reset, sort, phân trang, chi tiết và chuyển tới đặt lịch với xe đã chọn; chọn brand từ trang Brands |
| user-saved-cars / 03-saved-cars.spec.ts | Trạng thái rỗng, lưu xe từ listing/detail, favorites qua reload, mở chi tiết, compare đúng xe/highlight, remove, clear all |
| user-bookings / 04-bookings.spec.ts | Guest không đặt được; khách đặt → admin xác nhận → khách xem sau reload → hủy/giữ lịch sử; ngày quá khứ, trùng giờ và retry; tài khoản khác không thấy lịch |
| user-forms / 05-forms.spec.ts | Quên mật khẩu mô phỏng, liên hệ validation/submit/reset/FAQ, profile validation và cập nhật mock |

Các nhóm catalog/bookings/forms cần user-auth pass trước. saved-cars cần catalog pass.
Mỗi test tự tạo tài khoản hoặc dùng tài khoản seed độc lập, không lấy phiên từ test trước.
Test đặt lịch xác nhận liên vai trò tự đăng nhập admin trong chính context của nó,
không import helpers hay phụ thuộc test nằm trong folder admin.

## Giới hạn của ứng dụng đang được kiểm thử

- Backend và email được mô phỏng; “gửi link quên mật khẩu” không gửi email thật.
- Profile hiện dùng hồ sơ mẫu Jonathan Vance và danh sách savedProfiles trong component,
  chưa đồng bộ với tài khoản đăng nhập hoặc backend. Test xác minh validation và thông
  báo/bản ghi cục bộ, không tuyên bố thay đổi hồ sơ đã lưu lâu dài.
- Contact lưu messages trong component, chưa gửi email/tin nhắn ra ngoài.
- Favorites và danh sách so sánh nằm trong localStorage của trình duyệt, chưa tách theo
  từng tài khoản. Logout không tự xóa chúng. Xóa một xe khỏi Compare không xóa Favorite;
  bỏ Favorite/Clear All thì gỡ cả hai. Test ghi nhận đúng quy tắc hiện tại.
- Test đặt lịch xác minh quyền riêng tư trong giao diện và customerId dùng khi ghi mock;
  chưa phải bài đánh giá bảo mật backend hay phân quyền trên API thật.
- Không kiểm tra các nút chỉ có UI/console.log như Contact Dealer, Google sign-in,
  tìm kiếm navbar hoặc nút chuyển dạng hiển thị vì chưa có luồng chức năng hoàn chỉnh.
- Không thay đổi mã nguồn ứng dụng để làm test pass. Khi phát hiện lỗi thực tế cần sửa
  chức năng, báo cáo test và giới hạn này là căn cứ cho thay đổi riêng.
