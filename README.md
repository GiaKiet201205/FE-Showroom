# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.27.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Kiểm thử nâng cao (tùy chọn)

Unit test component/service bằng Angular TestBed, E2E bằng Playwright và CI được
đặt riêng trong [`testing/`](testing/README.md). Xem hướng dẫn tại đó để cài đặt,
chạy test và đọc báo cáo. Phần này không bắt buộc khi chạy, build hoặc trình bày đồ án;
CI chỉ chạy khi kích hoạt thủ công trong GitHub Actions.

Test được tách theo vai trò: `testing/admin/` cho quản trị và `testing/user/` cho
trang khách hàng. Có lệnh chạy và demo riêng cho từng nhóm trong hướng dẫn trên.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
