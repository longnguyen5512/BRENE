const LANG_KEY = 'brene_lang'

export const LANGUAGES = {
	en: 'English',
	tr: 'Türkçe',
	ru: 'Русский',
	es: 'Español',
	pt: 'Português',
	de: 'Deutsch',
	fr: 'Français',
	it: 'Italiano',
	id: 'Bahasa Indonesia',
	vi: 'Tiếng Việt',
	ar: 'العربية',
	zh: '中文',
	ja: '日本語',
	ko: '한국어',
	hi: 'हिन्दी',
}

export const CORE = {
	vi: {
		Home: 'Trang chủ', Android: 'Android', Hiding: 'Ẩn dấu vết', Spoofing: 'Giả mạo',
		SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Nâng cao', Info: 'Thông tin',
		Map: 'Map', Path: 'Path', 'Path Loop': 'Path Loop', 'Open Redirect': 'Open Redirect',
		'SUS Path UID Filter': 'Lọc UID SUS Path', 'USB Debug Allow Apps': 'App được phép thấy USB Debug',
		General: 'Thông tin chung', Recommendations: 'Khuyến nghị',
		'Recommended modules': 'Module khuyên dùng', 'Incompatible/Untested modules': 'Module xung đột / Chưa test',
		'Property spoofing': 'Giả mạo thuộc tính', 'Spoof verified boot hash property': 'Giả mạo Verified Boot Hash',
		Status: 'Trạng thái', 'Enabled kernel features': 'Tính năng kernel đã bật',
		'Built-in features': 'Tính năng tích hợp', 'Manual mode': 'Chế độ thủ công',
		'Custom ROM': 'Custom ROM', 'Module control': 'Quản lý module', Features: 'Tính năng',
		'Suspicious mounts': 'Mount đáng ngờ', 'BRENE logs': 'Nhật ký BRENE',
		'Device model': 'Mẫu thiết bị', 'Kernel version': 'Phiên bản Kernel', 'Android version': 'Phiên bản Android',
		'Check Play Integrity API': 'Kiểm tra Play Integrity API',
		'Developer options': 'Tùy chọn nhà phát triển', 'Options for developers': 'Các tùy chọn cho nhà phát triển',
		'USB debugging': 'Gỡ lỗi USB', 'Debug mode when USB is connected': 'Chế độ gỡ lỗi khi kết nối USB',
		'Wireless debugging': 'Gỡ lỗi không dây', 'Debug mode when Wi-Fi is connected': 'Chế độ gỡ lỗi qua Wi-Fi',
		'Show refresh rate': 'Hiện tần số quét', 'Show the current display refresh rate': 'Hiển thị tần số quét màn hình hiện tại',
		'Max color saturation': 'Bão hòa màu tối đa', 'Force maximum color saturation via SurfaceFlinger': 'Ép độ bão hòa màu tối đa qua SurfaceFlinger',
		'Set logcat buffer to 64KiB': 'Đặt bộ đệm logcat về 64KiB',
		'Reduce CPU overhead and battery drain by shrinking buffer size': 'Giảm tải CPU và hao pin bằng cách thu nhỏ bộ đệm logcat',
		'Disable child process restrictions': 'Tắt giới hạn tiến trình con',
		'Disable restrictions on the system resource usage of the app child processes': 'Tắt giới hạn tài nguyên hệ thống đối với tiến trình con của app',
		'Hide third party apps': 'Ẩn ứng dụng bên thứ 3',
		'Hide all apps with uid >= 10000': 'Ẩn toàn bộ app có UID >= 10000',
		'Hide them using PRIORITY_UID_FILTER feature, HMA-OSS is needed for userspace side': 'Ẩn bằng PRIORITY_UID_FILTER, cần kết hợp HMA-OSS ở phía userspace',
		'Hide KernelSU directories': 'Ẩn thư mục KernelSU', 'Hide custom recovery': 'Ẩn Custom Recovery',
		'Hide /data/local/tmp paths': 'Ẩn đường dẫn /data/local/tmp', '/data/local/tmp hiding exceptions': 'Ngoại lệ ẩn /data/local/tmp',
		'Fix /data/local/tmp inconsistencies': 'Sửa bất nhất /data/local/tmp',
		'Hide non-standard /sdcard paths': 'Ẩn đường dẫn lạ trong /sdcard',
		'Hide non-standard /sdcard/Android paths': 'Ẩn đường dẫn lạ trong /sdcard/Android',
		'Remove suspicious directories in /sdcard/Android/[data | media | obb]': 'Xóa thư mục đáng ngờ trong /sdcard/Android/[data | media | obb]',
		'Hide Vector Injection (Xposed Framework)': 'Ẩn Vector Injection (Xposed)',
		'Hide OEM unlocking toggle': 'Ẩn nút mở khóa OEM', 'Hide suspicious PTYs': 'Ẩn PTY đáng ngờ',
		'Spoof uname': 'Giả mạo uname', 'Spoof uname for all processes': 'Giả mạo uname cho mọi tiến trình',
		'Spoof system properties': 'Giả mạo System Properties', 'Spoof some system properties': 'Giả mạo các thuộc tính hệ thống quan trọng',
		'Spoof OS security patch level property': 'Giả mạo Security Patch của OS',
		'Spoof vendor security patch level property': 'Giả mạo Security Patch của Vendor',
		'Spoof /proc/cmdline or /proc/bootconfig': 'Giả mạo /proc/cmdline hoặc /proc/bootconfig',
		'SUSFS variant': 'Biến thể SUSFS', '..5.u.S status': 'Trạng thái ..5.u.S',
		'Hide suspicious mounts for non-su processes': 'Ẩn mount đáng ngờ với app không có su',
		'AVC log spoofing': 'Giả mạo AVC log', 'SUSFS logs': 'Nhật ký SUSFS',
		'Enable or disable SUSFS logs in kernel': 'Bật hoặc tắt log SUSFS trong kernel',
		'Enable or disable BRENE logs': 'Bật hoặc tắt nhật ký BRENE',
		'SU compat': 'Chế độ tương thích SU',
		"SU Compatibility Mode - allows authorized apps to gain root via traditional 'su' command": "Chế độ tương thích SU - cho phép app được cấp quyền dùng lệnh 'su'",
		'Kernel umount': 'Kernel Umount',
		'Kernel Umount - controls whether kernel automatically unmounts modules when not needed': 'Kernel Umount - tự động unmount module khi không cần thiết',
		'Adding sus mounts to umount list via built-in KernelSU kernel umount': 'Thêm sus mounts vào danh sách umount qua KernelSU kernel umount',
		'Hide SELinux modification': 'Ẩn chỉnh sửa SELinux',
		'SELinux Hide - sanitize /sys/fs/selinux access results for app UIDs': 'SELinux Hide - làm sạch kết quả truy vấn /sys/fs/selinux cho app UID',
		'Hide /system/addon.d': 'Ẩn /system/addon.d', 'Hide Gapps': 'Ẩn GApps', 'Hide Custom ROM paths': 'Ẩn đường dẫn Custom ROM',
		'Disable all modules': 'Tắt tất cả module', 'Enable all modules': 'Bật tất cả module',
		'Hide Custom ROM paths (Extended)': 'Ẩn đường dẫn Custom ROM (Mở rộng)', 'Hide LineageOS strings': 'Ẩn chuỗi LineageOS',
		'Spoof /system/etc/hosts': 'Giả mạo /system/etc/hosts', 'Some custom ROMs use a custom hosts file': 'Một số Custom ROM dùng file hosts tùy biến',
		'Spoof /system/lib64/libstagefright.so': 'Giả mạo /system/lib64/libstagefright.so',
		'Some custom ROMs use a custom libstagefright.so file': 'Một số Custom ROM dùng file libstagefright.so tùy biến',
		'Hide framework-res.apk': 'Ẩn framework-res.apk',
		'Remove Custom ROM properties': 'Xóa thuộc tính Custom ROM', 'Remove Play Integrity Fix properties': 'Xóa thuộc tính Play Integrity Fix',
		'Reset settings': 'Đặt lại cài đặt',
		'Select Apps': 'Chọn ứng dụng', Apply: 'Áp dụng', Cancel: 'Hủy', Language: 'Ngôn ngữ',
		'Search app or package': 'Tìm tên app hoặc package', 'Show system apps': 'Hiện ứng dụng hệ thống',
		'USB Debug Allow Apps (1 package/line)': 'App được phép thấy USB Debug (1 package/dòng)',
		'Package names': 'Tên package', EXCEPTIONS: 'Ngoại lệ', Mounts: 'Mounts',
		'Example:': 'Ví dụ:', 'Standard paths:': 'Đường dẫn chuẩn:', 'Important Notes:': 'Lưu ý quan trọng:',
		'Enter one package name per line': 'Nhập mỗi dòng một tên package',
		'Saved and applied': 'Đã lưu và áp dụng', 'Success, reboot to apply': 'Thành công, khởi động lại để áp dụng',
		'Loading apps...': 'Đang tải danh sách ứng dụng...',
	},
	zh: {
		Home: '主页', Android: 'Android', Hiding: '隐藏', Spoofing: '伪装',
		SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: '高级', Info: '信息',
		Map: 'Map', Path: 'Path', 'Path Loop': 'Path Loop', 'Open Redirect': 'Open Redirect',
		'SUS Path UID Filter': 'SUS Path UID 过滤', 'USB Debug Allow Apps': '允许检测 USB 调试的应用',
		General: '常规', Recommendations: '建议', 'Recommended modules': '推荐模块',
		'Incompatible/Untested modules': '不兼容 / 未测试模块', 'Property spoofing': '属性伪装',
		'Spoof verified boot hash property': '伪装 Verified Boot Hash 属性', Status: '状态',
		'Enabled kernel features': '已启用的内核功能', 'Built-in features': '内置功能',
		'Manual mode': '手动模式', 'Custom ROM': '第三方 ROM', 'Module control': '模块控制',
		Features: '功能', 'Suspicious mounts': '可疑挂载', 'BRENE logs': 'BRENE 日志',
		'Device model': '设备型号', 'Kernel version': '内核版本', 'Android version': 'Android 版本',
		'Check Play Integrity API': '检查 Play Integrity API', 'Developer options': '开发者选项',
		'Options for developers': '开发者工具选项', 'USB debugging': 'USB 调试',
		'Debug mode when USB is connected': '连接 USB 时启用调试模式', 'Wireless debugging': '无线调试',
		'Debug mode when Wi-Fi is connected': '连接 Wi-Fi 时启用调试模式', 'Show refresh rate': '显示刷新率',
		'Show the current display refresh rate': '显示当前屏幕刷新率', 'Max color saturation': '最大色彩饱和度',
		'Force maximum color saturation via SurfaceFlinger': '通过 SurfaceFlinger 强制最大饱和度',
		'Set logcat buffer to 64KiB': '将 logcat 缓冲区设为 64KiB',
		'Reduce CPU overhead and battery drain by shrinking buffer size': '减小缓冲区以降低 CPU 占用和耗电',
		'Disable child process restrictions': '禁用子进程限制',
		'Hide third party apps': '隐藏第三方应用', 'Hide all apps with uid >= 10000': '隐藏所有 UID >= 10000 的应用',
		'Hide KernelSU directories': '隐藏 KernelSU 目录', 'Hide custom recovery': '隐藏第三方 Recovery',
		'Hide /data/local/tmp paths': '隐藏 /data/local/tmp 路径', '/data/local/tmp hiding exceptions': '/data/local/tmp 隐藏例外',
		'Fix /data/local/tmp inconsistencies': '修复 /data/local/tmp 不一致',
		'Hide non-standard /sdcard paths': '隐藏 /sdcard 非标准路径', 'Hide non-standard /sdcard/Android paths': '隐藏 /sdcard/Android 非标准路径',
		'Remove suspicious directories in /sdcard/Android/[data | media | obb]': '删除 /sdcard/Android/[data | media | obb] 中的可疑目录',
		'Hide Vector Injection (Xposed Framework)': '隐藏 Vector 注入 (Xposed)', 'Hide OEM unlocking toggle': '隐藏 OEM 解锁开关',
		'Hide suspicious PTYs': '隐藏可疑 PTY', 'Spoof uname': '伪装 uname', 'Spoof uname for all processes': '为所有进程伪装 uname',
		'Spoof system properties': '伪装系统属性', 'Spoof some system properties': '伪装部分系统属性',
		'Spoof OS security patch level property': '伪装系统安全补丁级别', 'Spoof vendor security patch level property': '伪装 Vendor 安全补丁级别',
		'Spoof /proc/cmdline or /proc/bootconfig': '伪装 /proc/cmdline 或 /proc/bootconfig',
		'SUSFS variant': 'SUSFS 变体', '..5.u.S status': '..5.u.S 状态',
		'Hide suspicious mounts for non-su processes': '对非 su 进程隐藏可疑挂载', 'AVC log spoofing': 'AVC 日志伪装',
		'SUSFS logs': 'SUSFS 日志', 'Enable or disable SUSFS logs in kernel': '开启或关闭内核中的 SUSFS 日志',
		'Enable or disable BRENE logs': '开启或关闭 BRENE 日志', 'SU compat': 'SU 兼容模式',
		'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': '隐藏 SELinux 修改',
		'Hide /system/addon.d': '隐藏 /system/addon.d', 'Hide Gapps': '隐藏 GApps', 'Hide Custom ROM paths': '隐藏第三方 ROM 路径',
		'Disable all modules': '禁用所有模块', 'Enable all modules': '启用所有模块',
		'Hide Custom ROM paths (Extended)': '隐藏第三方 ROM 路径（扩展）', 'Hide LineageOS strings': '隐藏 LineageOS 字符串',
		'Spoof /system/etc/hosts': '伪装 /system/etc/hosts', 'Spoof /system/lib64/libstagefright.so': '伪装 /system/lib64/libstagefright.so',
		'Hide framework-res.apk': '隐藏 framework-res.apk', 'Remove Custom ROM properties': '移除第三方 ROM 属性',
		'Remove Play Integrity Fix properties': '移除 Play Integrity Fix 属性', 'Reset settings': '重置设置',
		'Select Apps': '选择应用', Apply: '应用', Cancel: '取消', Language: '语言',
		'Search app or package': '搜索应用或包名', 'Show system apps': '显示系统应用',
		'USB Debug Allow Apps (1 package/line)': '允许检测 USB 调试的应用（每行一个包名）',
		'Package names': '包名列表', EXCEPTIONS: '例外', Mounts: '挂载点',
		'Example:': '示例：', 'Standard paths:': '标准路径：', 'Important Notes:': '重要提示：',
		'Enter one package name per line': '每行输入一个包名',
		'Saved and applied': '已保存并生效', 'Success, reboot to apply': '成功，重启后生效',
		'Loading apps...': '正在加载应用列表...',
	},
	tr: {
		Home: 'Ana Sayfa', Android: 'Android', Hiding: 'Gizleme', Spoofing: 'Sahtecilik', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Gelişmiş', Info: 'Bilgi',
		General: 'Genel', Recommendations: 'Öneriler', 'Recommended modules': 'Önerilen modüller', 'Incompatible/Untested modules': 'Uyumsuz/Test edilmemiş modüller',
		'Property spoofing': 'Özellik sahteciliği', Status: 'Durum', 'Enabled kernel features': 'Etkin çekirdek özellikleri', 'Built-in features': 'Yerleşik özellikler',
		'Manual mode': 'Manuel mod', 'Custom ROM': 'Özel ROM', 'Module control': 'Modül kontrolü', Features: 'Özellikler', 'Suspicious mounts': 'Şüpheli bağlamalar', 'BRENE logs': 'BRENE günlükleri',
		'Device model': 'Cihaz modeli', 'Kernel version': 'Çekirdek sürümü', 'Android version': 'Android sürümü', 'Check Play Integrity API': 'Play Integrity API kontrol et',
		'Developer options': 'Geliştirici seçenekleri', 'Options for developers': 'Geliştiriciler için seçenekler', 'USB debugging': 'USB hata ayıklama', 'Debug mode when USB is connected': 'USB bağlıyken hata ayıklama modu',
		'Wireless debugging': 'Kablosuz hata ayıklama', 'Show refresh rate': 'Yenileme hızını göster', 'Max color saturation': 'Maksimum renk doygunluğu', 'Set logcat buffer to 64KiB': 'Logcat arabelleğini 64KiB yap',
		'Disable child process restrictions': 'Alt işlem kısıtlamalarını kapat', 'Hide third party apps': 'Üçüncü taraf uygulamaları gizle', 'Hide all apps with uid >= 10000': 'UID >= 10000 tüm uygulamaları gizle',
		'Hide KernelSU directories': 'KernelSU dizinlerini gizle', 'Hide custom recovery': 'Özel recovery gizle', 'Hide /data/local/tmp paths': '/data/local/tmp yollarını gizle',
		'Hide non-standard /sdcard paths': 'Standart dışı /sdcard yollarını gizle', 'Hide Vector Injection (Xposed Framework)': 'Vector enjeksiyonunu gizle', 'Hide OEM unlocking toggle': 'OEM kilit açma anahtarını gizle',
		'Spoof uname': 'uname sahteciliği', 'Spoof system properties': 'Sistem özelliklerini sahtele', 'SUSFS variant': 'SUSFS türü', 'Hide suspicious mounts for non-su processes': 'Su olmayan işlemler için şüpheli bağlamaları gizle',
		'AVC log spoofing': 'AVC günlük sahteciliği', 'SUSFS logs': 'SUSFS günlükleri', 'SU compat': 'SU uyumluluğu', 'Kernel umount': 'Kernel umount', 'Hide SELinux modification': 'SELinux değişikliğini gizle',
		'Reset settings': 'Ayarları sıfırla', 'Select Apps': 'Uygulama Seç', Apply: 'Uygula', Cancel: 'İptal', Language: 'Dil',
		'USB Debug Allow Apps': 'USB Hata Ayıklama İzinli Uygulamalar', 'Search app or package': 'Uygulama veya paket ara', 'Show system apps': 'Sistem uygulamalarını göster',
		'Saved and applied': 'Kaydedildi ve uygulandı', 'Success, reboot to apply': 'Başarılı, uygulamak için yeniden başlatın', 'Loading apps...': 'Uygulamalar yükleniyor...',
		'Hide Gapps': 'GApps Gizle', 'Disable all modules': 'Tüm modülleri devre dışı bırak', 'Enable all modules': 'Tüm modülleri etkinleştir',
	},
	ru: {
		Home: 'Главная', Android: 'Android', Hiding: 'Скрытие', Spoofing: 'Подмена', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Дополнительно', Info: 'Инфо',
		General: 'Общее', Recommendations: 'Рекомендации', 'Recommended modules': 'Рекомендуемые модули', 'Incompatible/Untested modules': 'Несовместимые модули',
		'Property spoofing': 'Подмена свойств', Status: 'Статус', 'Enabled kernel features': 'Функции ядра', 'Built-in features': 'Встроенные функции',
		'Manual mode': 'Ручной режим', 'Custom ROM': 'Кастомная прошивка', 'Module control': 'Управление модулями', Features: 'Функции', 'Suspicious mounts': 'Подозрительные монтирования', 'BRENE logs': 'Логи BRENE',
		'Device model': 'Модель устройства', 'Kernel version': 'Версия ядра', 'Android version': 'Версия Android', 'Check Play Integrity API': 'Проверить Play Integrity API',
		'Developer options': 'Для разработчиков', 'Options for developers': 'Параметры разработчика', 'USB debugging': 'Отладка по USB', 'Debug mode when USB is connected': 'Режим отладки при подключении USB',
		'Wireless debugging': 'Отладка по Wi-Fi', 'Show refresh rate': 'Показывать частоту обновления', 'Max color saturation': 'Макс. насыщенность цвета', 'Set logcat buffer to 64KiB': 'Буфер logcat 64KiB',
		'Disable child process restrictions': 'Отключить ограничения дочерних процессов', 'Hide third party apps': 'Скрыть сторонние приложения', 'Hide all apps with uid >= 10000': 'Скрыть все приложения с UID >= 10000',
		'Hide KernelSU directories': 'Скрыть каталоги KernelSU', 'Hide custom recovery': 'Скрыть кастомное recovery', 'Hide /data/local/tmp paths': 'Скрыть /data/local/tmp',
		'Hide non-standard /sdcard paths': 'Скрыть нестандартные пути /sdcard', 'Hide Vector Injection (Xposed Framework)': 'Скрыть инъекцию Vector', 'Hide OEM unlocking toggle': 'Скрыть разблокировку OEM',
		'Spoof uname': 'Подмена uname', 'Spoof system properties': 'Подмена системных свойств', 'SUSFS variant': 'Вариант SUSFS', 'Hide suspicious mounts for non-su processes': 'Скрыть монтирования для non-su',
		'AVC log spoofing': 'Подмена логов AVC', 'SUSFS logs': 'Логи SUSFS', 'SU compat': 'Совместимость SU', 'Kernel umount': 'Kernel umount', 'Hide SELinux modification': 'Скрыть изменения SELinux',
		'Reset settings': 'Сбросить настройки', 'Select Apps': 'Выбрать приложения', Apply: 'Применить', Cancel: 'Отмена', Language: 'Язык',
		'USB Debug Allow Apps': 'Приложения для отладки USB', 'Search app or package': 'Поиск приложения или пакета', 'Show system apps': 'Показать системные приложения',
		'Saved and applied': 'Сохранено и применено', 'Success, reboot to apply': 'Готово, перезагрузите для применения', 'Loading apps...': 'Загрузка приложений...',
		'Hide Gapps': 'Скрыть GApps', 'Disable all modules': 'Отключить все модули', 'Enable all modules': 'Включить все модули',
	},
	es: {
		Home: 'Inicio', Android: 'Android', Hiding: 'Ocultar', Spoofing: 'Suplantar', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Avanzado', Info: 'Info',
		General: 'General', Recommendations: 'Recomendaciones', 'Recommended modules': 'Módulos recomendados', 'Incompatible/Untested modules': 'Módulos incompatibles',
		'Property spoofing': 'Suplantación de propiedades', Status: 'Estado', 'Enabled kernel features': 'Funciones del kernel activas', 'Built-in features': 'Funciones integradas',
		'Manual mode': 'Modo manual', 'Custom ROM': 'ROM personalizada', 'Module control': 'Control de módulos', Features: 'Funciones', 'Suspicious mounts': 'Montajes sospechosos', 'BRENE logs': 'Registros BRENE',
		'Device model': 'Modelo del dispositivo', 'Kernel version': 'Versión del kernel', 'Android version': 'Versión de Android', 'Check Play Integrity API': 'Comprobar Play Integrity API',
		'Developer options': 'Opciones de desarrollador', 'Options for developers': 'Opciones para desarrolladores', 'USB debugging': 'Depuración USB', 'Wireless debugging': 'Depuración inalámbrica',
		'Show refresh rate': 'Mostrar tasa de refresco', 'Max color saturation': 'Saturación máxima de color', 'Set logcat buffer to 64KiB': 'Búfer logcat a 64KiB',
		'Disable child process restrictions': 'Desactivar restricciones de procesos hijos', 'Hide third party apps': 'Ocultar apps de terceros', 'Hide all apps with uid >= 10000': 'Ocultar apps con UID >= 10000',
		'Hide KernelSU directories': 'Ocultar directorios KernelSU', 'Hide custom recovery': 'Ocultar recovery personalizado', 'Hide /data/local/tmp paths': 'Ocultar /data/local/tmp',
		'Spoof uname': 'Suplantar uname', 'Spoof system properties': 'Suplantar propiedades del sistema', 'SUSFS variant': 'Variante SUSFS', 'SU compat': 'Compatibilidad SU', 'Kernel umount': 'Kernel umount', 'Hide SELinux modification': 'Ocultar cambios SELinux',
		'Reset settings': 'Restablecer ajustes', 'Select Apps': 'Seleccionar apps', Apply: 'Aplicar', Cancel: 'Cancelar', Language: 'Idioma',
		'USB Debug Allow Apps': 'Apps permitidas para depuración USB', 'Search app or package': 'Buscar app o paquete', 'Show system apps': 'Mostrar apps del sistema',
		'Saved and applied': 'Guardado y aplicado', 'Success, reboot to apply': 'Éxito, reinicia para aplicar', 'Loading apps...': 'Cargando aplicaciones...',
		'Hide Gapps': 'Ocultar GApps', 'Disable all modules': 'Desactivar todos los módulos', 'Enable all modules': 'Activar todos los módulos',
	},
	pt: {
		Home: 'Início', Android: 'Android', Hiding: 'Ocultar', Spoofing: 'Simulação', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Avançado', Info: 'Info',
		General: 'Geral', Recommendations: 'Recomendações', 'Recommended modules': 'Módulos recomendados', 'Incompatible/Untested modules': 'Módulos incompatíveis',
		'Property spoofing': 'Simulação de propriedades', Status: 'Status', 'Enabled kernel features': 'Recursos do kernel ativos', 'Built-in features': 'Recursos integrados',
		'Manual mode': 'Modo manual', 'Custom ROM': 'ROM personalizada', 'Module control': 'Controle de módulos', Features: 'Recursos', 'Suspicious mounts': 'Montagens suspeitas', 'BRENE logs': 'Logs do BRENE',
		'Device model': 'Modelo do dispositivo', 'Kernel version': 'Versão do kernel', 'Android version': 'Versão do Android', 'Check Play Integrity API': 'Verificar Play Integrity API',
		'Developer options': 'Opções do desenvolvedor', 'USB debugging': 'Depuração USB', 'Wireless debugging': 'Depuração sem fio', 'Show refresh rate': 'Mostrar taxa de atualização',
		'Max color saturation': 'Saturação máxima de cor', 'Set logcat buffer to 64KiB': 'Definir buffer logcat para 64KiB', 'Disable child process restrictions': 'Desativar restrições de processos filhos',
		'Hide third party apps': 'Ocultar apps de terceiros', 'Hide all apps with uid >= 10000': 'Ocultar apps com UID >= 10000', 'Hide KernelSU directories': 'Ocultar diretórios KernelSU',
		'Spoof uname': 'Simular uname', 'Spoof system properties': 'Simular propriedades do sistema', 'SUSFS variant': 'Variante SUSFS', 'SU compat': 'Compatibilidade SU', 'Kernel umount': 'Kernel umount', 'Hide SELinux modification': 'Ocultar modificações SELinux',
		'Reset settings': 'Redefinir configurações', 'Select Apps': 'Selecionar apps', Apply: 'Aplicar', Cancel: 'Cancelar', Language: 'Idioma',
		'USB Debug Allow Apps': 'Apps permitidos para depuração USB', 'Search app or package': 'Pesquisar app ou pacote', 'Show system apps': 'Mostrar apps do sistema',
		'Saved and applied': 'Salvo e aplicado', 'Success, reboot to apply': 'Sucesso, reinicie para aplicar', 'Loading apps...': 'Carregando aplicativos...',
		'Hide Gapps': 'Ocultar GApps', 'Disable all modules': 'Desativar todos os módulos', 'Enable all modules': 'Ativar todos os módulos',
	},
	de: {
		Home: 'Start', Android: 'Android', Hiding: 'Verbergen', Spoofing: 'Spoofing', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Erweitert', Info: 'Info',
		General: 'Allgemein', Recommendations: 'Empfehlungen', 'Recommended modules': 'Empfohlene Module', 'Incompatible/Untested modules': 'Inkompatible Module',
		'Property spoofing': 'Eigenschafts-Spoofing', Status: 'Status', 'Enabled kernel features': 'Aktive Kernel-Funktionen', 'Built-in features': 'Integrierte Funktionen',
		'Manual mode': 'Manueller Modus', 'Custom ROM': 'Custom ROM', 'Module control': 'Modulsteuerung', Features: 'Funktionen', 'Suspicious mounts': 'Verdächtige Mounts', 'BRENE logs': 'BRENE-Protokolle',
		'Device model': 'Gerätemodell', 'Kernel version': 'Kernel-Version', 'Android version': 'Android-Version', 'Check Play Integrity API': 'Play Integrity API prüfen',
		'Developer options': 'Entwickleroptionen', 'USB debugging': 'USB-Debugging', 'Wireless debugging': 'Kabelloses Debugging', 'Show refresh rate': 'Bildwiederholrate anzeigen',
		'Max color saturation': 'Maximale Farbsättigung', 'Set logcat buffer to 64KiB': 'Logcat-Puffer auf 64KiB setzen', 'Disable child process restrictions': 'Kindprozess-Einschränkungen deaktivieren',
		'Hide third party apps': 'Drittanbieter-Apps verbergen', 'Hide all apps with uid >= 10000': 'Alle Apps mit UID >= 10000 verbergen', 'Hide KernelSU directories': 'KernelSU-Verzeichnisse verbergen',
		'Spoof uname': 'uname fälschen', 'Spoof system properties': 'Systemeigenschaften fälschen', 'SUSFS variant': 'SUSFS-Variante', 'SU compat': 'SU-Kompatibilität', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'SELinux-Änderungen verbergen',
		'Reset settings': 'Einstellungen zurücksetzen', 'Select Apps': 'Apps auswählen', Apply: 'Anwenden', Cancel: 'Abbrechen', Language: 'Sprache',
		'USB Debug Allow Apps': 'Apps für USB-Debugging erlauben', 'Search app or package': 'App oder Paket suchen', 'Show system apps': 'System-Apps anzeigen',
		'Saved and applied': 'Gespeichert und angewendet', 'Success, reboot to apply': 'Erfolg, zum Anwenden neu starten', 'Loading apps...': 'Apps werden geladen...',
		'Hide Gapps': 'GApps verbergen', 'Disable all modules': 'Alle Module deaktivieren', 'Enable all modules': 'Alle Module aktivieren',
	},
	fr: {
		Home: 'Accueil', Android: 'Android', Hiding: 'Masquage', Spoofing: 'Usurpation', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Avancé', Info: 'Info',
		General: 'Général', Recommendations: 'Recommandations', 'Recommended modules': 'Modules recommandés', 'Incompatible/Untested modules': 'Modules incompatibles',
		'Property spoofing': 'Usurpation des propriétés', Status: 'Statut', 'Enabled kernel features': 'Fonctions noyau actives', 'Built-in features': 'Fonctions intégrées',
		'Manual mode': 'Mode manuel', 'Custom ROM': 'ROM personnalisée', 'Module control': 'Contrôle des modules', Features: 'Fonctionnalités', 'Suspicious mounts': 'Montages suspects', 'BRENE logs': 'Journaux BRENE',
		'Device model': "Modèle de l'appareil", 'Kernel version': 'Version du noyau', 'Android version': "Version d'Android", 'Check Play Integrity API': 'Vérifier Play Integrity API',
		'Developer options': 'Options développeur', 'USB debugging': 'Débogage USB', 'Wireless debugging': 'Débogage sans fil', 'Show refresh rate': 'Afficher taux de rafraîchissement',
		'Max color saturation': 'Saturation maximale', 'Set logcat buffer to 64KiB': 'Tampon logcat à 64KiB', 'Disable child process restrictions': 'Désactiver limites processus enfants',
		'Hide third party apps': 'Masquer les apps tierces', 'Hide all apps with uid >= 10000': 'Masquer toutes les apps UID >= 10000', 'Hide KernelSU directories': 'Masquer les dossiers KernelSU',
		'Spoof uname': 'Usurper uname', 'Spoof system properties': 'Usurper propriétés système', 'SUSFS variant': 'Variante SUSFS', 'SU compat': 'Compatibilité SU', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'Masquer modifs SELinux',
		'Reset settings': 'Réinitialiser', 'Select Apps': 'Choisir des apps', Apply: 'Appliquer', Cancel: 'Annuler', Language: 'Langue',
		'USB Debug Allow Apps': 'Apps autorisées (Débogage USB)', 'Search app or package': 'Rechercher app ou paquet', 'Show system apps': 'Afficher les apps système',
		'Saved and applied': 'Enregistré et appliqué', 'Success, reboot to apply': 'Succès, redémarrez pour appliquer', 'Loading apps...': 'Chargement des applications...',
		'Hide Gapps': 'Masquer GApps', 'Disable all modules': 'Désactiver tous les modules', 'Enable all modules': 'Activer tous les modules',
	},
	it: {
		Home: 'Home', Android: 'Android', Hiding: 'Nascondi', Spoofing: 'Spoofing', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Avanzate', Info: 'Info',
		General: 'Generale', Recommendations: 'Consigli', 'Recommended modules': 'Moduli consigliati', 'Incompatible/Untested modules': 'Moduli incompatibili',
		'Property spoofing': 'Spoofing proprietà', Status: 'Stato', 'Enabled kernel features': 'Funzioni kernel attive', 'Built-in features': 'Funzioni integrate',
		'Manual mode': 'Modalità manuale', 'Custom ROM': 'ROM personalizzata', 'Module control': 'Controllo moduli', Features: 'Funzionalità', 'Suspicious mounts': 'Mount sospetti', 'BRENE logs': 'Log BRENE',
		'Device model': 'Modello dispositivo', 'Kernel version': 'Versione kernel', 'Android version': 'Versione Android', 'Check Play Integrity API': 'Verifica Play Integrity API',
		'Developer options': 'Opzioni sviluppatore', 'USB debugging': 'Debug USB', 'Wireless debugging': 'Debug wireless', 'Show refresh rate': 'Mostra refresh rate',
		'Max color saturation': 'Saturazione colore massima', 'Set logcat buffer to 64KiB': 'Buffer logcat a 64KiB', 'Hide third party apps': 'Nascondi app di terze parti',
		'Hide all apps with uid >= 10000': 'Nascondi app con UID >= 10000', 'Hide KernelSU directories': 'Nascondi cartelle KernelSU', 'Spoof uname': 'Falsifica uname',
		'Spoof system properties': 'Falsifica proprietà di sistema', 'SUSFS variant': 'Variante SUSFS', 'SU compat': 'Compatibilità SU', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'Nascondi modifiche SELinux',
		'Reset settings': 'Ripristina impostazioni', 'Select Apps': 'Seleziona app', Apply: 'Applica', Cancel: 'Annulla', Language: 'Lingua',
		'USB Debug Allow Apps': 'App consentite Debug USB', 'Search app or package': 'Cerca app o pacchetto', 'Show system apps': 'Mostra app di sistema',
		'Saved and applied': 'Salvato e applicato', 'Success, reboot to apply': 'Fatto, riavvia per applicare', 'Loading apps...': 'Caricamento app...',
		'Hide Gapps': 'Nascondi GApps', 'Disable all modules': 'Disattiva tutti i moduli', 'Enable all modules': 'Attiva tutti i moduli',
	},
	id: {
		Home: 'Beranda', Android: 'Android', Hiding: 'Sembunyikan', Spoofing: 'Spoofing', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'Lanjutan', Info: 'Info',
		General: 'Umum', Recommendations: 'Rekomendasi', 'Recommended modules': 'Modul disarankan', 'Incompatible/Untested modules': 'Modul tidak kompatibel',
		'Property spoofing': 'Spoofing properti', Status: 'Status', 'Enabled kernel features': 'Fitur kernel aktif', 'Built-in features': 'Fitur bawaan',
		'Manual mode': 'Mode manual', 'Custom ROM': 'Custom ROM', 'Module control': 'Kontrol modul', Features: 'Fitur', 'Suspicious mounts': 'Mount mencurigakan', 'BRENE logs': 'Log BRENE',
		'Device model': 'Model perangkat', 'Kernel version': 'Versi kernel', 'Android version': 'Versi Android', 'Check Play Integrity API': 'Cek Play Integrity API',
		'Developer options': 'Opsi pengembang', 'USB debugging': 'Debugging USB', 'Wireless debugging': 'Debugging nirkabel', 'Show refresh rate': 'Tampilkan refresh rate',
		'Max color saturation': 'Saturasi warna maksimal', 'Set logcat buffer to 64KiB': 'Atur buffer logcat 64KiB', 'Hide third party apps': 'Sembunyikan aplikasi pihak ketiga',
		'Hide all apps with uid >= 10000': 'Sembunyikan semua aplikasi UID >= 10000', 'Hide KernelSU directories': 'Sembunyikan direktori KernelSU', 'Spoof uname': 'Spoof uname',
		'Spoof system properties': 'Spoof properti sistem', 'SUSFS variant': 'Varian SUSFS', 'SU compat': 'Kompatibilitas SU', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'Sembunyikan modifikasi SELinux',
		'Reset settings': 'Setel ulang', 'Select Apps': 'Pilih Aplikasi', Apply: 'Terapkan', Cancel: 'Batal', Language: 'Bahasa',
		'USB Debug Allow Apps': 'Aplikasi Diizinkan Debug USB', 'Search app or package': 'Cari aplikasi atau paket', 'Show system apps': 'Tampilkan aplikasi sistem',
		'Saved and applied': 'Disimpan dan diterapkan', 'Success, reboot to apply': 'Berhasil, mulai ulang untuk menerapkan', 'Loading apps...': 'Memuat aplikasi...',
		'Hide Gapps': 'Sembunyikan GApps', 'Disable all modules': 'Nonaktifkan semua modul', 'Enable all modules': 'Aktifkan semua modul',
	},
	ar: {
		Home: 'الرئيسية', Android: 'أندرويد', Hiding: 'الإخفاء', Spoofing: 'التمويه', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'متقدم', Info: 'معلومات',
		General: 'عام', Recommendations: 'توصيات', 'Recommended modules': 'وحدات موصى بها', 'Incompatible/Untested modules': 'وحدات غير متوافقة',
		'Property spoofing': 'تمويه الخصائص', Status: 'الحالة', 'Enabled kernel features': 'ميزات النواة المفعلة', 'Built-in features': 'الميزات المدمجة',
		'Manual mode': 'الوضع اليدوي', 'Custom ROM': 'روم مخصص', 'Module control': 'التحكم بالوحدات', Features: 'الميزات', 'Suspicious mounts': 'نقاط التحميل المشبوهة', 'BRENE logs': 'سجلات BRENE',
		'Device model': 'طراز الجهاز', 'Kernel version': 'إصدار النواة', 'Android version': 'إصدار أندرويد', 'Check Play Integrity API': 'فحص Play Integrity API',
		'Developer options': 'خيارات المطور', 'USB debugging': 'تصحيح أخطاء USB', 'Wireless debugging': 'التصحيح اللاسلكي', 'Show refresh rate': 'إظهار معدل التحديث',
		'Max color saturation': 'أقصى تشبع للألوان', 'Set logcat buffer to 64KiB': 'تعيين مخزن logcat إلى 64KiB', 'Hide third party apps': 'إخفاء تطبيقات الطرف الثالث',
		'Hide all apps with uid >= 10000': 'إخفاء التطبيقات ذات UID >= 10000', 'Hide KernelSU directories': 'إخفاء مجلدات KernelSU', 'Spoof uname': 'تمويه uname',
		'Spoof system properties': 'تمويه خصائص النظام', 'SUSFS variant': 'نوع SUSFS', 'SU compat': 'توافق SU', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'إخفاء تعديلات SELinux',
		'Reset settings': 'إعادة تعيين', 'Select Apps': 'اختر التطبيقات', Apply: 'تطبيق', Cancel: 'إلغاء', Language: 'اللغة',
		'USB Debug Allow Apps': 'تطبيقات تصحيح USB المسموح بها', 'Search app or package': 'ابحث عن تطبيق أو حزمة', 'Show system apps': 'إظهار تطبيقات النظام',
		'Saved and applied': 'تم الحفظ والتطبيق', 'Success, reboot to apply': 'تم بنجاح، أعد التشغيل للتطبيق', 'Loading apps...': 'جاري تحميل التطبيقات...',
		'Hide Gapps': 'إخفاء GApps', 'Disable all modules': 'تعطيل جميع الوحدات', 'Enable all modules': 'تفعيل جميع الوحدات',
	},
	ja: {
		Home: 'ホーム', Android: 'Android', Hiding: '非表示', Spoofing: '偽装', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: '詳細', Info: '情報',
		General: '一般', Recommendations: '推奨事項', 'Recommended modules': '推奨モジュール', 'Incompatible/Untested modules': '非互換モジュール',
		'Property spoofing': 'プロパティ偽装', Status: 'ステータス', 'Enabled kernel features': '有効なカーネル機能', 'Built-in features': '組み込み機能',
		'Manual mode': '手動モード', 'Custom ROM': 'カスタム ROM', 'Module control': 'モジュール管理', Features: '機能', 'Suspicious mounts': '不審なマウント', 'BRENE logs': 'BRENE ログ',
		'Device model': '端末モデル', 'Kernel version': 'カーネルバージョン', 'Android version': 'Android バージョン', 'Check Play Integrity API': 'Play Integrity API を確認',
		'Developer options': '開発者向けオプション', 'USB debugging': 'USB デバッグ', 'Wireless debugging': 'ワイヤレス デバッグ', 'Show refresh rate': 'リフレッシュレートを表示',
		'Max color saturation': '最大彩度', 'Set logcat buffer to 64KiB': 'logcat バッファを 64KiB に設定', 'Hide third party apps': 'サードパーティアプリを隠す',
		'Hide all apps with uid >= 10000': 'UID >= 10000 のアプリをすべて隠す', 'Hide KernelSU directories': 'KernelSU ディレクトリを隠す', 'Spoof uname': 'uname を偽装',
		'Spoof system properties': 'システムプロパティを偽装', 'SUSFS variant': 'SUSFS バリアント', 'SU compat': 'SU 互換モード', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'SELinux 変更を隠す',
		'Reset settings': '設定をリセット', 'Select Apps': 'アプリを選択', Apply: '適用', Cancel: 'キャンセル', Language: '言語',
		'USB Debug Allow Apps': 'USB デバッグ許可アプリ', 'Search app or package': 'アプリまたはパッケージを検索', 'Show system apps': 'システムアプリを表示',
		'Saved and applied': '保存して適用しました', 'Success, reboot to apply': '成功しました。再起動して適用してください', 'Loading apps...': 'アプリを読み込み中...',
		'Hide Gapps': 'GApps を隠す', 'Disable all modules': 'すべてのモジュールを無効化', 'Enable all modules': 'すべてのモジュールを有効化',
	},
	ko: {
		Home: '홈', Android: 'Android', Hiding: '숨기기', Spoofing: '스푸핑', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: '고급', Info: '정보',
		General: '일반', Recommendations: '권장 사항', 'Recommended modules': '권장 모듈', 'Incompatible/Untested modules': '호환되지 않는 모듈',
		'Property spoofing': '속성 스푸핑', Status: '상태', 'Enabled kernel features': '활성화된 커널 기능', 'Built-in features': '내장 기능',
		'Manual mode': '수동 모드', 'Custom ROM': '커스텀 ROM', 'Module control': '모듈 제어', Features: '기능', 'Suspicious mounts': '의심스러운 마운트', 'BRENE logs': 'BRENE 로그',
		'Device model': '기기 모델', 'Kernel version': '커널 버전', 'Android version': 'Android 버전', 'Check Play Integrity API': 'Play Integrity API 확인',
		'Developer options': '개발자 옵션', 'USB debugging': 'USB 디버깅', 'Wireless debugging': '무선 디버깅', 'Show refresh rate': '주사율 표시',
		'Max color saturation': '최대 색상 채도', 'Set logcat buffer to 64KiB': 'logcat 버퍼 64KiB 설정', 'Hide third party apps': '서드파티 앱 숨기기',
		'Hide all apps with uid >= 10000': 'UID >= 10000 모든 앱 숨기기', 'Hide KernelSU directories': 'KernelSU 디렉터리 숨기기', 'Spoof uname': 'uname 스푸핑',
		'Spoof system properties': '시스템 속성 스푸핑', 'SUSFS variant': 'SUSFS 변형', 'SU compat': 'SU 호환 모드', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'SELinux 수정 숨기기',
		'Reset settings': '설정 초기화', 'Select Apps': '앱 선택', Apply: '적용', Cancel: '취소', Language: '언어',
		'USB Debug Allow Apps': 'USB 디버깅 허용 앱', 'Search app or package': '앱 또는 패키지 검색', 'Show system apps': '시스템 앱 표시',
		'Saved and applied': '저장 및 적용됨', 'Success, reboot to apply': '완료, 적용하려면 재부팅하세요', 'Loading apps...': '앱 목록 불러오는 중...',
		'Hide Gapps': 'GApps 숨기기', 'Disable all modules': '모든 모듈 비활성화', 'Enable all modules': '모든 모듈 활성화',
	},
	hi: {
		Home: 'होम', Android: 'Android', Hiding: 'छिपाएँ', Spoofing: 'स्पूफिंग', SUSFS: 'SUSFS', KSU: 'KSU', ROM: 'ROM', Advanced: 'उन्नत', Info: 'जानकारी',
		General: 'सामान्य', Recommendations: 'सुझाव', 'Recommended modules': 'अनुशंसित मॉड्यूल', 'Incompatible/Untested modules': 'असंगत मॉड्यूल',
		'Property spoofing': 'प्रॉपर्टी स्पूफिंग', Status: 'स्थिति', 'Enabled kernel features': 'सक्रिय कर्नेल सुविधाएँ', 'Built-in features': 'अंतर्निहित सुविधाएँ',
		'Manual mode': 'मैनुअल मोड', 'Custom ROM': 'कस्टम ROM', 'Module control': 'मॉड्यूल नियंत्रण', Features: 'सुविधाएँ', 'Suspicious mounts': 'संदिग्ध माउंट', 'BRENE logs': 'BRENE लॉग',
		'Device model': 'डिवाइस मॉडल', 'Kernel version': 'कर्नेल संस्करण', 'Android version': 'Android संस्करण', 'Check Play Integrity API': 'Play Integrity API जाँचें',
		'Developer options': 'डेवलपर विकल्प', 'USB debugging': 'USB डिबगिंग', 'Wireless debugging': 'वायरलेस डिबगिंग', 'Show refresh rate': 'रिफ्रेश रेट दिखाएँ',
		'Max color saturation': 'अधिकतम रंग संतृप्ति', 'Set logcat buffer to 64KiB': 'logcat बफर 64KiB सेट करें', 'Hide third party apps': 'थर्ड-पार्टी ऐप्स छिपाएँ',
		'Hide all apps with uid >= 10000': 'UID >= 10000 सभी ऐप्स छिपाएँ', 'Hide KernelSU directories': 'KernelSU फ़ोल्डर छिपाएँ', 'Spoof uname': 'uname स्पूफ करें',
		'Spoof system properties': 'सिस्टम प्रॉपर्टीज़ स्पूफ करें', 'SUSFS variant': 'SUSFS प्रकार', 'SU compat': 'SU संगतता', 'Kernel umount': 'Kernel Umount', 'Hide SELinux modification': 'SELinux बदलाव छिपाएँ',
		'Reset settings': 'सेटिंग्स रीसेट करें', 'Select Apps': 'ऐप्स चुनें', Apply: 'लागू करें', Cancel: 'रद्द करें', Language: 'भाषा',
		'USB Debug Allow Apps': 'USB डिबगिंग अनुमत ऐप्स', 'Search app or package': 'ऐप या पैकेज खोजें', 'Show system apps': 'सिस्टम ऐप्स दिखाएँ',
		'Saved and applied': 'सहेजा और लागू किया गया', 'Success, reboot to apply': 'सफल, लागू करने के लिए रीबूट करें', 'Loading apps...': 'ऐप्स लोड हो रहे हैं...',
		'Hide Gapps': 'GApps छिपाएँ', 'Disable all modules': 'सभी मॉड्यूल अक्षम करें', 'Enable all modules': 'सभी मॉड्यूल सक्षम करें',
	},
}

let currentLang = (() => {
	try {
		const saved = localStorage.getItem(LANG_KEY)
		if (saved && saved in LANGUAGES) return saved
	} catch {}
	const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean)
	for (const l of langs) {
		const code = l.toLowerCase().split(/[-_]/)[0]
		if (code in LANGUAGES) return code
	}
	return 'en'
})()

export function getLang() {
	return currentLang
}

export function t(key) {
	if (currentLang === 'en') return key
	return CORE[currentLang]?.[key] || key
}

const SELECTORS = [
	'.tab-btn',
	'md-primary-tab',
	'.section-label',
	'.card-row__title',
	'.card-row__sub',
	'.card-row__tag--code',
	'md-filled-button',
	'md-outlined-button',
	'md-text-button',
	'#usb_debug_apps_dialog [slot="headline"]',
	'#lang_dialog [slot="headline"]',
	'.app-picker-filter-row span',
]

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()

export function applyLanguage(lang) {
	currentLang = lang in LANGUAGES ? lang : 'en'
	try {
		localStorage.setItem(LANG_KEY, currentLang)
	} catch {}

	document.documentElement.lang = currentLang
	document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'

	const badge = document.getElementById('lang-badge')
	if (badge) badge.textContent = currentLang.toUpperCase()

	for (const sel of SELECTORS) {
		document.querySelectorAll(sel).forEach((el) => {
			if (el.children.length > 0) {
				// Translate direct text nodes (e.g., title before <span class="chip-exp">)
				for (const node of el.childNodes) {
					if (node.nodeType === Node.TEXT_NODE) {
						const raw = norm(node.nodeValue)
						if (!raw || raw === '_') continue
						if (!node._i18nOrig) node._i18nOrig = raw
						const translated = t(node._i18nOrig)
						if (translated !== node._i18nOrig || currentLang === 'en') {
							node.nodeValue = `${translated} `
						}
					}
				}
				return
			}
			if (!el.dataset.i18nOrig) {
				el.dataset.i18nOrig = norm(el.textContent)
			}
			const orig = el.dataset.i18nOrig
			if (orig && orig !== '_') {
				el.textContent = t(orig)
			}
		})
	}

	document.querySelectorAll('md-filled-text-field[label]').forEach((field) => {
		if (!field.dataset.i18nOrig) field.dataset.i18nOrig = field.label
		field.label = t(field.dataset.i18nOrig)
	})
}
