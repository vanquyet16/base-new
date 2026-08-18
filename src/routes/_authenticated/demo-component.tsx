import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/demo-component')({
  component: DemoComponent,
})

import React, { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomTable, { type ColumnType } from '@/shared/ui/common/customs/Tables/CustomTable'
import { TableAction } from '@/shared/ui/common/customs/Tables/TableAction'
import CustomPagination from '@/shared/ui/common/customs/Tables/CustomPagination'
import { Button } from '@/shared/ui/shadcn/button'
import CustomButton from '@/shared/ui/common/customs/CustomButton'
import { Eye } from 'lucide-react'
import { Form } from '@/shared/ui/shadcn/form'
import { FormFieldWrapper } from '@/shared/ui/common/FormFieldWrapper'
import { Input } from '@/shared/ui/shadcn/input'
import { Textarea } from '@/shared/ui/shadcn/textarea'
import { demoComponentSchema } from '@/features/demo-component/schemas/demo-component.schema'
import CustomDatePicker, { DATE_FORMATS } from '@/shared/ui/common/customs/CustomDatePicker'
import AppIcon from '@/shared/ui/core/AppIcon'
import CustomModalConfirm from '@/shared/ui/common/customs/Modals/CustomModalConfirm'
import CustomModal from '@/shared/ui/common/customs/Modals/CustomModal'
import CustomFooterModal from '@/shared/ui/common/customs/Modals/CustomFooterModal'
import { toast } from '@/shared/stores/toast.store'
import CustomTableUpload from '@/shared/ui/common/customs/Tables/CustomTableUpload'
import CustomDropPagination from '@/shared/ui/common/customs/CustomDropPagination'
import { useDemoComponentLogic } from '@/features/demo-component/hooks/useDemoComponentLogic'

/**
 * Interface định nghĩa dữ liệu người dùng mẫu
 */
interface UserData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  age: number
  role: string
  joinDate: string
  status: 'active' | 'inactive'
}

// Dữ liệu mẫu (dummy data) phong phú hơn
const dummyData: UserData[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'vana@example.com',
    phone: '0901234567',
    address: 'Hà Nội',
    age: 28,
    role: 'Admin',
    joinDate: '2025-01-10',
    status: 'active',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'thib@example.com',
    phone: '0912345678',
    address: 'Hồ Chí Minh',
    age: 24,
    role: 'User',
    joinDate: '2025-02-15',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'vanc@example.com',
    phone: '0923456789',
    address: 'Đà Nẵng',
    age: 32,
    role: 'Manager',
    joinDate: '2024-11-20',
    status: 'active',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'thid@example.com',
    phone: '0934567890',
    address: 'Hải Phòng',
    age: 29,
    role: 'User',
    joinDate: '2024-12-05',
    status: 'active',
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    email: 'vane@example.com',
    phone: '0945678901',
    address: 'Cần Thơ',
    age: 35,
    role: 'Admin',
    joinDate: '2025-03-01',
    status: 'inactive',
  },
  {
    id: '6',
    name: 'Vũ Thị F',
    email: 'thif@example.com',
    phone: '0956789012',
    address: 'Nha Trang',
    age: 26,
    role: 'Editor',
    joinDate: '2025-03-10',
    status: 'active',
  },
  {
    id: '7',
    name: 'Đặng Văn G',
    email: 'vang@example.com',
    phone: '0967890123',
    address: 'Huế',
    age: 40,
    role: 'User',
    joinDate: '2024-10-10',
    status: 'inactive',
  },
  {
    id: '8',
    name: 'Bùi Thị H',
    email: 'thih@example.com',
    phone: '0978901234',
    address: 'Vinh',
    age: 27,
    role: 'Manager',
    joinDate: '2025-01-25',
    status: 'active',
  },
  {
    id: '9',
    name: 'Đỗ Văn I',
    email: 'vani@example.com',
    phone: '0989012345',
    address: 'Quy Nhơn',
    age: 31,
    role: 'User',
    joinDate: '2025-02-28',
    status: 'active',
  },
  {
    id: '10',
    name: 'Ngô Thị K',
    email: 'thik@example.com',
    phone: '0990123456',
    address: 'Đà Lạt',
    age: 23,
    role: 'Editor',
    joinDate: '2025-03-15',
    status: 'active',
  },
]

function DemoComponent() {
  // Quản lý trạng thái các dòng được chọn trên bảng
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // Cấu hình các cột cho CustomTable
  // Sử dụng useMemo để tránh việc mảng columns bị tạo lại sau mỗi lần render
  const columns = useMemo<ColumnType<UserData>[]>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 60,
        align: 'center',
      },
      {
        title: 'Họ và tên',
        dataIndex: 'name',
        width: 180,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: 220,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        width: 130,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: 'Tuổi',
        dataIndex: 'age',
        align: 'center',
        width: 70,
      },
      {
        title: 'Vai trò',
        dataIndex: 'role',
        width: 110,
      },
      {
        title: 'Ngày tham gia',
        dataIndex: 'joinDate',
        width: 130,
        align: 'center',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        width: 120,
        render: (value) => (
          <span
            className={
              value === 'active'
                ? 'whitespace-nowrap rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-600'
                : 'whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600'
            }
          >
            {value === 'active' ? 'Hoạt động' : 'Đã khoá'}
          </span>
        ),
      },
      {
        title: 'Hành động',
        key: 'actions',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: (_, record) => (
          <TableAction type="edit" onClick={() => alert(`Sửa người dùng: ${record.name}`)} />
        ),
      },
    ],
    [],
  )
  // ─── State cho các ví dụ CustomDatePicker ────────────────────────────────────
  const [dateAsDate, setDateAsDate] = useState<Date | undefined>()
  const [dateAsIso, setDateAsIso] = useState<string | undefined>()
  const [dateAsTimestamp, setDateAsTimestamp] = useState<number | undefined>()
  const [dateAsString, setDateAsString] = useState<string | undefined>()
  const [dateAsYear, setDateAsYear] = useState<number | undefined>()
  const [dateAsMonth, setDateAsMonth] = useState<number | undefined>()
  const [dateRange, setDateRange] = useState<
    | {
        from: Date | string | number | undefined
        to: Date | string | number | undefined
      }
    | undefined
  >({
    // Giá trị mặc định hiển thị sẵn trong input: 25/03/2026 → 31/03/2026
    from: new Date(2026, 2, 25), // tháng tính từ 0 nên tháng 3 = index 2
    to: new Date(2026, 2, 31),
  })
  const [multipleDates, setMultipleDates] = useState<(Date | string | number | undefined)[]>([])

  // ─── State cho Demo CustomModal ───────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleSaveModal = async () => {
    setModalLoading(true)
    // Giả lập lưu dữ liệu 2.5s
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setModalLoading(false)
    setModalOpen(false)
    alert('Đã lưu dữ liệu thành công!')
  }

  // ─── Standard Form Demo (Matching Image Layout) ──────────────────────────
  const standardForm = useForm({
    resolver: zodResolver(demoComponentSchema),
    defaultValues: {
      cqBanHanh: [],
      soVanBan: '',
      loaiVanBan: 'Công văn',
      soDen: '',
      ngayVanBan: '2026-03-25',
      ngayDen: '2026-03-25',
      soKyHieu: '',
      hanXuLy: undefined,
      trichYeu: '',
      fileDinhKem: [
        {
          id: '5276abdc-8300-4026-8885-76987171f64d',
          fileName: 'Van_ban_huong_dan_01.pdf',
          extension: '.pdf',
          size: 1024 * 500,
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          id: 'a1b2c3d4-e5f6-4a5b-8c9d-e1f2a3b4c5d6',
          fileName: 'Bao_cao_ket_qua_cong_viec.docx',
          extension: '.docx',
          size: 1024 * 250,
        },
      ],
    },
  })

  const onStandardSubmit = useCallback((data: any) => {
    // Demo việc chỉ lấy ID của file để gửi lên server
    const submitData = {
      ...data,
      fileIds: data.fileDinhKem?.map((f: any) => f.id) || [],
    }
    console.log('🚀 ~ onStandardSubmit ~ submitData:', submitData)
    alert(`Dữ liệu gửi đi (đã map file IDs):\n${JSON.stringify(submitData, null, 2)}`)
  }, [])

  return (
    <div className="min-h-full space-y-4 bg-background">
      {/* demo app icon */}
      <div className="flex-col space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">App icon </h2>
        <div className="flex gap-4">
          <AppIcon name="Home" size={24} color="blue" />
          <AppIcon type="tabler" name="IconSmartHome" />
          <AppIcon type="ant" name="AiOutlineUser" />
          <AppIcon type="fa" name="FaGithub" />
        </div>
      </div>
      {/* demo modal confirm */}
      <div className="flex-col space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">Custom Modal Confirm </h2>
        <div className="flex gap-4">
          <CustomModalConfirm
            type="success"
            onSubmit={async () => {
              await new Promise((resolve) => setTimeout(resolve, 2000))
              console.log('Xác nhận thành công')
            }}
            content={{
              title: 'Xác nhận thành công',
              description: 'Hành động này sẽ được thực hiện sau 2 giây loading.',
              submitText: 'Đồng ý',
            }}
          >
            <CustomButton title="Xác nhận Success" variant="success-outline" />
          </CustomModalConfirm>

          <CustomModalConfirm
            type="danger"
            onSubmit={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1500))
              console.log('Xóa thành công')
            }}
            content={{
              title: 'Xác nhận xóa',
              description:
                'Bạn có chắc chắn muốn xóa dữ liệu này không? Hành động này không thể hoàn tác.',
              submitText: 'Xóa ngay',
              cancelText: 'Hủy bỏ',
            }}
          >
            <CustomButton title="Xóa dữ liệu (Danger)" variant="destructive" />
          </CustomModalConfirm>

          <CustomModalConfirm
            type="warning"
            onSubmit={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
            content={{
              title: 'Cảnh báo',
              description: 'Đây là nội dung cảnh báo mẫu.',
            }}
          >
            <CustomButton title="Cảnh báo (Warning)" variant="warning-outline" />
          </CustomModalConfirm>
        </div>
      </div>

      {/* demo custom modal frame */}
      <div className="flex-col space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">Custom Modal (Frame & Body) </h2>
        <div className="flex gap-4">
          <CustomButton
            title="Mở Modal Chỉnh Sửa"
            variant="default"
            icon={<AppIcon type="tabler" name="IconEdit" size={18} />}
            onClick={handleOpenModal}
          />

          <CustomModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Cập nhật thông tin hồ sơ"
            width={700}
            loading={modalLoading}
            footer={
              <CustomFooterModal
                onOk={handleSaveModal}
                onCancel={() => setModalOpen(false)}
                okText="Cập nhật ngay"
                okLoading={modalLoading}
              />
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Đây là nội dung được truyền qua props <code>children</code>. Bạn có thể để bất kỳ
                component nào ở đây.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="modal-name" className="text-sm font-medium">Họ và tên</label>
                  <Input id="modal-name" placeholder="Nguyễn Văn A" defaultValue="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="modal-email" className="text-sm font-medium">Email</label>
                  <Input id="modal-email" placeholder="vana@example.com" defaultValue="vana@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="modal-address" className="text-sm font-medium">Địa chỉ chi tiết</label>
                <Input id="modal-address" placeholder="Số 1, Đường ABC, Quận XYZ" />
              </div>
              <div className="rounded bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                <strong>Lưu ý:</strong> Khi đang trong trạng thái <code>loading</code>, toàn bộ nội
                dung body sẽ bị mờ đi và người dùng không thể thao tác, đồng thời không thể đóng
                modal bằng cách nhấn ra ngoài hoặc Escape.
              </div>
            </div>
          </CustomModal>
        </div>
      </div>
      {/* ─── Demo CustomDatePicker ───────────────────────────────────────────── */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">CustomDatePicker — Các loại format</h2>

        {/* Single — output Date object */}
        <div className="space-y-1">
          <span className="text-sm font-medium">
            Single — output: Date object (displayFormat: dd/MM/yyyy)
          </span>
          <CustomDatePicker
            mode="single"
            value={dateAsDate}
            onChange={(v) => setDateAsDate(v as Date | undefined)}
            displayFormat={DATE_FORMATS.VN_DATE}
            outputType="date"
            placeholder="Chọn ngày..."
          />
          <p className="text-xs text-muted-foreground">Giá trị: {dateAsDate?.toString() ?? '—'}</p>
        </div>

        {/* Single — output ISO string */}
        <div className="space-y-1">
          <span className="text-sm font-medium">
            Single — output: ISO string (displayFormat: yyyy-MM-dd)
          </span>
          <CustomDatePicker
            mode="single"
            value={dateAsIso}
            onChange={(v) => setDateAsIso(v as string | undefined)}
            displayFormat={DATE_FORMATS.ISO_DATE}
            outputType="iso"
            placeholder="Chọn ngày ISO..."
          />
          <p className="text-xs text-muted-foreground">Giá trị ISO: {dateAsIso ?? '—'}</p>
        </div>

        {/* Single — output Unix timestamp */}
        <div className="space-y-1">
          <span className="text-sm font-medium">
            Single — output: Timestamp (displayFormat: dd/MM/yyyy HH:mm)
          </span>
          <CustomDatePicker
            mode="single"
            showTime
            value={dateAsTimestamp}
            onChange={(v) => setDateAsTimestamp(v as number | undefined)}
            displayFormat={DATE_FORMATS.VN_DATETIME}
            outputType="timestamp"
            placeholder="Chọn ngày giờ..."
          />
          <p className="text-xs text-muted-foreground">Timestamp: {dateAsTimestamp ?? '—'}</p>
        </div>

        {/* Single — output formatted string */}
        <div className="space-y-1">
          <span className="text-sm font-medium">
            Single — output: String (displayFormat: dd MMMM, yyyy)
          </span>
          <CustomDatePicker
            mode="single"
            value={dateAsString}
            onChange={(v) => setDateAsString(v as string)}
            displayFormat={DATE_FORMATS.VN_LONG}
            outputType="string"
            placeholder="Chọn ngày xuất chuỗi..."
          />
          <p className="text-xs text-muted-foreground">Chuỗi lưu: {dateAsString || 'Chưa chọn'}</p>
        </div>

        {/* Single — output Year */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Single — output: Year (Năm)</span>
          <CustomDatePicker
            mode="single"
            value={dateAsYear ? new Date(dateAsYear, 0) : undefined}
            onChange={(v) => setDateAsYear(v as number)}
            displayFormat="yyyy"
            outputType="year"
            initialView="years"
            placeholder="Chọn năm..."
          />
          <p className="text-xs text-muted-foreground">
            Năm được chọn: {dateAsYear ? String(dateAsYear) : 'Chưa chọn'}
          </p>
        </div>

        {/* Single — output Month */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Single — output: Month (Tháng)</span>
          <CustomDatePicker
            mode="single"
            value={dateAsMonth ? new Date(2026, dateAsMonth - 1) : undefined}
            onChange={(v) => setDateAsMonth(v as number)}
            displayFormat="MM/yyyy"
            outputType="month"
            initialView="months"
            placeholder="Chọn tháng..."
          />
          <p className="text-xs text-muted-foreground">
            Tháng được chọn: {dateAsMonth ? `Tháng ${dateAsMonth}` : 'Chưa chọn'}
          </p>
        </div>

        {/* Range — quick presets */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Range — từ ngày đến ngày</span>
          <CustomDatePicker
            mode="range"
            value={dateRange as { from?: Date; to?: Date }}
            onChange={(v) => setDateRange(v as typeof dateRange)}
            displayFormat={DATE_FORMATS.VN_DATE}
            outputType="date"
            showPresets
            placeholder="Chọn khoảng ngày..."
          />
          {dateRange?.from instanceof Date && dateRange?.to instanceof Date && (
            <p className="text-xs text-muted-foreground">
              Từ: {dateRange.from.toLocaleDateString('vi-VN')} — Đến:{' '}
              {dateRange.to.toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>

        {/* Multiple */}
        <div className="space-y-1">
          <span className="text-sm font-medium">Multiple — chọn nhiều ngày</span>
          <CustomDatePicker
            mode="multiple"
            value={multipleDates as Date[]}
            onChange={(v) => setMultipleDates((v as (Date | string | number | undefined)[]) ?? [])}
            displayFormat={DATE_FORMATS.VN_DATE}
            outputType="date"
            placeholder="Chọn nhiều ngày..."
          />
          <p className="text-xs text-muted-foreground">Số ngày đã chọn: {multipleDates.length}</p>
        </div>
      </div>
      {/* ─── Demo Toast ────────────────────────────────────────────────────── */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">Animated Toast — Chế độ thông báo mới</h2>
        <div className="flex flex-wrap gap-4">
          <CustomButton
            title="Success Toast"
            variant="success"
            onClick={() => toast.success('Chúc mừng! Dữ liệu đã được lưu thành công.')}
          />
          <CustomButton
            title="Error Toast"
            variant="destructive"
            onClick={() => toast.error('Lỗi! Không thể kết nối đến máy chủ.')}
          />
          <CustomButton
            title="Warning Toast"
            variant="warning"
            onClick={() => toast.warning('Cảnh báo! Dung lượng bộ nhớ sắp đầy.')}
          />
          <CustomButton
            title="Info Toast"
            variant="info"
            onClick={() => toast.info('Thông báo: Chế độ bảo trì sẽ bắt đầu sau 5 phút.')}
          />
          <CustomButton
            title="Toast with Title"
            variant="default"
            onClick={() => toast.success('Đã tải xong tập tin.', { title: 'Tải xuống hoàn tất' })}
          />
        </div>
      </div>

      <h1 className="text-lg font-bold">Ví dụ Form chuẩn</h1>
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <DemoStandardForm form={standardForm} onSubmit={onStandardSubmit} />
      </div>
      {/* // button */}
      <div className="flex gap-4">
        <CustomButton title="Lưu" />
        <CustomButton title="Xoá" tooltip="Xoá dữ liệu này" placement="top" variant="destructive" />
        <CustomButton title="Tải xuống" icon="/icons/download.svg" iconPosition="start" />
        <CustomButton title="Đang xử lý..." loading />
        <CustomButton title="Lưu" variant="success" />
        <CustomButton title="Chờ duyệt" variant="warning" />
        <CustomButton title="Xem chi tiết" variant="info" icon={<Eye />} />
        <CustomButton title="Xác nhận" variant="success-outline" />
        <CustomButton title="Cảnh báo" variant="warning-outline" />
        <CustomButton title="Thông tin" variant="info-outline" />
        <Button variant="success">Lưu</Button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Danh sách người dùng Demo</h1>
        {selectedRowKeys.length > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Đã chọn {selectedRowKeys.length} dòng
          </span>
        )}
      </div>
      <CustomTable<UserData>
        columns={columns}
        data={dummyData}
        rowKey="id"
        bordered
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        emptyText="Không có dữ liệu người dùng"
      />
      <CustomPagination
        paramPage={{ page: 1, pageSize: 10 }}
        setParamPage={() => {}}
        total={dummyData.length}
      />
    </div>
  )
}

/**
 * DemoStandardForm — Component hiển thị form theo layout 4 cột yêu cầu.
 * Sử dụng FormFieldWrapper để chuẩn hóa label/asterisk/error.
 */
const DemoStandardForm = ({ form, onSubmit }: { form: any; onSubmit: (data: any) => void }) => {
  const [dateAsDate, setDateAsDate] = useState<Date | undefined>(new Date())
  const { loadDemoOptions } = useDemoComponentLogic()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: 4 columns */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormFieldWrapper control={form.control} name="cqBanHanh" label="CQ ban hành" required>
            {(field) => (
              <CustomDropPagination
                loadOptions={loadDemoOptions}
                additional={{ page: 1 }}
                valueType="primitive"
                placeholder="Chọn nhiều cơ quan (Primitive)..."
                isMulti
                isClearable
                maxTags={2}
                valueKey="id"
                labelKey="userName"
                onChange={(value) => {
                  field.onChange(value)
                  console.log(value)
                }}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soVanBan" label="Số văn bản" required>
            <Input placeholder="Nhập số..." />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="loaiVanBan" label="Loại văn bản" required>
            <CustomDropPagination
              maxTags={2}
              options={[
                { value: 'Công văn', label: 'Công văn' },
                { value: 'Nghị quyết', label: 'Nghị quyết' },
                { value: 'Quyết định', label: 'Quyết định' },
                { value: 'Thông báo', label: 'Thông báo' },
              ]}
              formatPrimitiveLabel={(v) => v}
              placeholder="Chọn loại văn bản..."
            />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soDen" label="Số đến" required>
            <Input placeholder="Nhập số đến..." />
          </FormFieldWrapper>
        </div>

        {/* Row 2: 4 columns */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormFieldWrapper control={form.control} name="ngayVanBan" label="Ngày văn bản" required>
            {(_field) => (
              <CustomDatePicker
                mode="single"
                value={dateAsDate}
                onChange={(v) => setDateAsDate(v as Date | undefined)}
                displayFormat={DATE_FORMATS.VN_DATE}
                outputType="date"
                placeholder="Chọn ngày..."
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="ngayDen" label="Ngày đến" required>
            <CustomDatePicker mode="single" outputType="iso" />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="soKyHieu" label="Số ký hiệu" required>
            <Input placeholder="Nhập số ký hiệu..." />
          </FormFieldWrapper>

          <FormFieldWrapper control={form.control} name="hanXuLy" label="Hạn xử lý">
            <CustomDatePicker mode="single" outputType="iso" placeholder="dd/MM/yyyy" />
          </FormFieldWrapper>
        </div>

        {/* Row 3: 1 column (Full width) — dùng Textarea thay Input để Enter xuống dòng đúng chuẩn */}
        <FormFieldWrapper control={form.control} name="trichYeu" label="Trích yếu" required>
          <Textarea
            placeholder="Nhập trích yếu..."
            className="min-h-[80px] resize-none shadow-sm"
          />
        </FormFieldWrapper>

        {/* Row 4: File Upload (minio integration demo) */}
        <div className="space-y-2">
          <FormFieldWrapper control={form.control} name="fileDinhKem" label="Tệp tin đính kèm">
            <CustomTableUpload />
          </FormFieldWrapper>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Làm mới
          </Button>
          <Button type="submit" variant="success">
            Gửi dữ liệu
          </Button>
        </div>
      </form>
    </Form>
  )
}
