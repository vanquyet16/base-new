import React, { useMemo } from "react";
import * as LucideIcons from "lucide-react";
import * as TablerIcons from "@tabler/icons-react";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa6";
import * as HiIcons from "react-icons/hi2";
import * as MdIcons from "react-icons/md";
import { cn } from "@/shared/lib/utils";

/**
 * Danh sách các thư viện icon được hỗ trợ
 */
export type AppIconType = "lucide" | "tabler" | "ant" | "fa" | "hi" | "md";

interface AppIconProps {
  /** Loại thư viện icon */
  type?: AppIconType;
  /** Tên icon (ví dụ: Home, IconSmartHome, AiOutlineUser) */
  name: string;
  /** Kích thước icon (mặc định: 20) */
  size?: number | string;
  /** Màu sắc icon */
  color?: string;
  /** Class CSS bổ sung */
  className?: string;
}

/**
 * AppIcon — Component hiển thị icon linh hoạt từ nhiều thư viện khác nhau.
 * Hỗ trợ: Lucide, Tabler, Ant Design, Font Awesome 6, Heroicons 2, Material Design.
 *
 * @example
 * <AppIcon type="lucide" name="Home" />
 * <AppIcon type="tabler" name="IconSmartHome" />
 * <AppIcon type="ant" name="AiOutlineUser" />
 */
const AppIcon = React.memo(
  ({
    type = "lucide",
    name,
    size = 20,
    color,
    className,
  }: AppIconProps) => {
    // Lấy component icon tương ứng dựa trên type và name
    const IconComponent = useMemo(() => {
      type IconMap = Record<string, React.ComponentType<{ size?: number | string; color?: string; className?: string }>>
      try {
        switch (type) {
          case "lucide":
            return (LucideIcons as unknown as IconMap)[name];
          case "tabler":
            return (TablerIcons as unknown as IconMap)[name];
          case "ant":
            return (AiIcons as unknown as IconMap)[name];
          case "fa":
            return (FaIcons as unknown as IconMap)[name];
          case "hi":
            return (HiIcons as unknown as IconMap)[name];
          case "md":
            return (MdIcons as unknown as IconMap)[name];
          default:
            return (LucideIcons as unknown as IconMap)[name];
        }
      } catch (error) {
        console.error(`[AppIcon] Icon "${name}" not found in library "${type}"`, error);
        return null;
      }
    }, [type, name]);

    // Nếu không tìm thấy icon, render một khoảng trống hoặc icon mặc định
    if (!IconComponent) {
      return (
        <div 
          style={{ width: size, height: size }} 
          className={cn("inline-flex items-center justify-center text-muted-foreground", className)}
        >
          {/* Hiển thị icon cảnh báo nhỏ nếu không tìm thấy trong môi trường dev */}
          {process.env.NODE_ENV === "development" && <LucideIcons.HelpCircle size={size} />}
        </div>
      );
    }

    return (
      <IconComponent
        size={size}
        color={color}
        className={cn("shrink-0", className)}
      />
    );
  }
);

AppIcon.displayName = "AppIcon";

export default AppIcon;
