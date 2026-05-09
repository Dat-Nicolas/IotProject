/**
 * Vietnamese Language Translations
 * Complete Vietnamese localization for the Smart AC App
 */

export const vi = {
  // Navigation & Tabs
  navigation: {
    dashboard: 'Bảng điều khiển',
    profile: 'Hồ sơ',
    back: 'Quay lại',
  },

  // Auth Screens
  auth: {
    signIn: 'Đăng nhập',
    signUp: 'Đăng ký',
    createAccount: 'Tạo tài khoản',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    fullName: 'Họ và tên',
    signingIn: 'Đang đăng nhập...',
    registering: 'Đang đăng ký...',
    alreadyHaveAccount: 'Đã có tài khoản? Đăng nhập',
    noAccount: 'Chưa có tài khoản? Đăng ký',
    signInToAccount: 'Đăng nhập vào tài khoản của bạn',
    registerNewUser: 'Đăng ký người dùng Smart AC mới',
  },

  // Dashboard
  dashboard: {
    title: 'Bảng điều khiển',
    welcomeBack: 'Chào mừng trở lại',
    rooms: 'Phòng',
    noRooms: 'Chưa có phòng nào',
    roomsCount: 'Tổng số phòng',
    temperature: 'Nhiệt độ',
    people: 'Người',
    peoplePerAC: 'Người trên một máy',
    currentTemp: 'Nhiệt độ hiện tại',
    targetTemp: 'Nhiệt độ mục tiêu',
    autoMode: 'Chế độ tự động',
  },

  // Room Details
  room: {
    details: 'Chi tiết phòng',
    name: 'Tên phòng',
    location: 'Vị trí',
    currentPeople: 'Số người hiện tại',
    manualControl: 'Điều khiển thủ công',
    schedule: 'Lịch biểu',
    configuration: 'Cấu hình',
    activityHistory: 'Lịch sử hoạt động',
    brandSelection: 'Chọn nhãn hiệu',
  },

  // Control
  control: {
    manualControl: 'Điều khiển thủ công',
    power: 'Bật/Tắt',
    temperature: 'Nhiệt độ',
    mode: 'Chế độ',
    cool: 'Làm lạnh',
    heat: 'Sưởi ấm',
    dry: 'Sấy',
    fan: 'Quạt',
    speed: 'Tốc độ',
    auto: 'Tự động',
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    sleep: 'Chế độ ngủ',
  },

  // Configuration
  config: {
    title: 'Cấu hình',
    subtitle: 'Cài đặt điều khiển tự động phòng',
    peoplePerAC: 'Người trên một máy',
    minTemp: 'Nhiệt độ tối thiểu',
    maxTemp: 'Nhiệt độ tối đa',
    defaultTemp: 'Nhiệt độ mặc định',
    autoMode: 'Chế độ tự động',
    startTime: 'Thời gian bắt đầu',
    endTime: 'Thời gian kết thúc',
    save: 'Lưu',
    saving: 'Đang lưu...',
    success: 'Thành công',
    configUpdated: 'Cấu hình đã được cập nhật',
  },

  // Schedule
  schedule: {
    title: 'Lịch biểu',
    subtitle: 'Quản lý lịch hoạt động của máy lạnh',
    addSchedule: 'Thêm lịch',
    editSchedule: 'Chỉnh sửa lịch',
    deleteSchedule: 'Xóa lịch',
    day: 'Ngày',
    startTime: 'Thời gian bắt đầu',
    endTime: 'Thời gian kết thúc',
    temperature: 'Nhiệt độ',
    enabled: 'Kích hoạt',
    disabled: 'Vô hiệu hóa',
    monday: 'Thứ hai',
    tuesday: 'Thứ ba',
    wednesday: 'Thứ tư',
    thursday: 'Thứ năm',
    friday: 'Thứ sáu',
    saturday: 'Thứ bảy',
    sunday: 'Chủ nhật',
  },

  // Activity History
  activity: {
    title: 'Lịch sử hoạt động',
    subtitle: 'Lịch sử điều khiển máy lạnh',
    timestamp: 'Thời gian',
    action: 'Hành động',
    status: 'Trạng thái',
    noActivity: 'Chưa có hoạt động',
    powerOn: 'Bật',
    powerOff: 'Tắt',
    tempChanged: 'Thay đổi nhiệt độ',
    modeChanged: 'Thay đổi chế độ',
  },

  // Profile
  profile: {
    title: 'Hồ sơ',
    personalInfo: 'Thông tin cá nhân',
    editProfile: 'Chỉnh sửa hồ sơ',
    name: 'Tên',
    email: 'Email',
    phone: 'Số điện thoại',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    logout: 'Đăng xuất',
    loggingOut: 'Đang đăng xuất...',
    changePassword: 'Đổi mật khẩu',
    about: 'Giới thiệu',
    version: 'Phiên bản',
  },

  // Common
  common: {
    ok: 'OK',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    add: 'Thêm',
    close: 'Đóng',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    failed: 'Thất bại',
    retry: 'Thử lại',
    confirm: 'Xác nhận',
    confirmDelete: 'Bạn có chắc chắn muốn xóa?',
    noData: 'Không có dữ liệu',
    emptyList: 'Danh sách trống',
    tryAgain: 'Vui lòng thử lại',
  },

  // Errors
  errors: {
    unableToSignIn: 'Không thể đăng nhập. Vui lòng thử lại.',
    unableToCreateAccount: 'Không thể tạo tài khoản. Vui lòng thử lại.',
    updateFailed: 'Cập nhật thất bại',
    networkError: 'Lỗi kết nối mạng',
    validationError: 'Lỗi xác thực',
    requiredField: 'Trường này là bắt buộc',
    invalidEmail: 'Email không hợp lệ',
    passwordMismatch: 'Mật khẩu không khớp',
    shortPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
  },

  // Validations
  validation: {
    emailRequired: 'Email là bắt buộc',
    passwordRequired: 'Mật khẩu là bắt buộc',
    nameRequired: 'Tên là bắt buộc',
    confirmPasswordRequired: 'Xác nhận mật khẩu là bắt buộc',
    invalidEmail: 'Email không hợp lệ',
    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
    passwordMismatch: 'Mật khẩu không khớp',
  },
};

export type TranslationKey = string;
