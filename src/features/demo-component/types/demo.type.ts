export interface DemoApiPanigationRequest {
    PageInfo: {
        page: number;
        pageSize: number;
    };
    UserName: string;
    ReceiveUserId: string;
    ReceiveUserRoleId: string;
    ReceiveUserDeptId: string;
    Users: {
        userId: string;
        deptId: string;
        roleId: string;
    }[];
}

export interface response {
    id: string;
    parentId: string;
    name: string;
    code: string;
    roleId: string;
    vaiTro: string;
    positionId: string;
    positionName: string;
    positionCode: string;
    deptId: string;
    deptName: string;
    userId: string;
    deptCode: string;
    userName: string;
    isPerson: boolean;
    isLeader: boolean;
    level: number;
    thuocDonVi: string;
    disabled: boolean;
    deptType: string;
    type: string;
    symbol: string;
    path: string;
    isBTC: boolean;
}