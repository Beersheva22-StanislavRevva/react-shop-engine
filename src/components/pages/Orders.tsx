import { Box,  Button,  Modal, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import Employee from "../../model/Employee";
import { employeesService, ordersService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { DeleteOutline, InventoryOutlined, HighlightOffOutlined, Visibility} from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorCart, useSelectorEmployees, useSelectorOrders } from "../../hooks/hooks";
import EmployeeCard from "../cards/EmployeeCard";
import UserData from "../../model/UserData";
import CartItem from "../../model/CartItem";
const columnsCommon: GridColDef[] = [
    // {
    //     field: 'serial', headerName: '#', flex: 0.3, headerClassName: 'data-grid-header',
    //     align: 'center', headerAlign: 'center'
    // },
    {
        field: 'id', headerName: 'ID', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    
    {
        field: 'dateTime', headerName: 'Creation Time', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'email', headerName: 'Email', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'adress', headerName: 'Adress', flex: 0.7, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'phone', headerName: 'Pnone', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'totalSum', headerName: 'TotalSum', type: 'number', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'status', headerName: 'Status', flex: 0.5, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    
   
   ];
   
   
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Orders: React.FC = () => {
    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    // <GridActionsCellItem label="remove" icon={<AddCircleOutline />}
                    //     onClick={() => updateQuantity(params.row, 1)
                    //     } />,
                    <GridActionsCellItem label="details" icon={<InventoryOutlined />}
                        onClick={() => console.log("details clicked")
                        } />,
                    <GridActionsCellItem label="remove" icon={<HighlightOffOutlined/>}
                        onClick={() => console.log("cancelOrder clicked")
                        } />,
                    // <GridActionsCellItem label="update" icon={<Edit />}
                    //     onClick={() => {
                    //         employeeId.current = params.id as any;
                    //         if (params.row) {
                    //             const empl = params.row;
                    //             empl && (employee.current = empl);
                    //             setFlEdit(true)
                    //         }
    
                    //     }
                    //     } />
                ] ;
            }
        }
       ]
       const columnsPortrait: GridColDef[] = [
        columnsCommon[0],
        columnsCommon[1],
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                   
                    <GridActionsCellItem label="details" icon={<Visibility />}
                        onClick={() => {
                            employeeId.current = params.id as any;
                            if (params.row) {
                                const empl = params.row;
                                empl && (employee.current = empl);
                                setFlDetails(true)
                            }
    
                        }
                        } />
                ] ;
            }
        }
       ]
    const dispatch = useDispatchCode();
    const userData = useSelectorAuth();
    const cartProducts = useSelectorCart();
    const employees = useSelectorEmployees();
    const orders = useSelectorOrders();
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'));
    const columns = useMemo(() => getColumns(), [userData, cartProducts, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    const employee = useRef<Employee | undefined>();
    
    
    function getColumns(): GridColDef[] {
        
        return isPortrait ? columnsPortrait : getColumnsFromLandscape();
    }
    function getColumnsFromLandscape(): GridColDef[]{
        let res: GridColDef[] = columnsCommon;
         res = res.concat(columnsAdmin);
    return res;
    }
    function removeEmployee(id: any) {
        title.current = "Remove Employee object?";
        const employee = cartProducts.find(empl => empl.id == id);
        content.current = `You are going remove employee with id ${employee?.id}`;
        employeeId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await ordersService.deleteCartProduct(employeeId.current);
            } catch (error: any) {
                errorMessage = error;
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);
    }
    function updateEmployee(empl: Employee): Promise<InputResult> {
        setFlEdit(false)
        const res: InputResult = { status: 'error', message: '' };
        if (JSON.stringify(employee.current) != JSON.stringify(empl)) {
            title.current = "Update Employee object?";
            employee.current = empl;
            content.current = `You are going update employee with id ${empl.id}`;
            confirmFn.current = actualUpdate;
            setOpenConfirm(true);
        }
        return Promise.resolve(res);
    }
    async function actualUpdate(isOk: boolean) {
        
       
        let errorMessage: string = '';

        if (isOk) {
            try {
                await ordersService.updateCartProduct(employee.current!);
            } catch (error: any) {
                errorMessage = error
            }
        }
        dispatch(errorMessage, '');
        setOpenConfirm(false);

    }
    function cardAction(isDelete: boolean){
        if (isDelete) {
            removeEmployee(employeeId.current);
        } else {
            setFlEdit(true)
        }
        setFlDetails(false)
    }
    async function updateQuantity (empl:any, newQuant:number): Promise<void> {
        const quantity= empl.quantity || 0;
        const emplCopy = { ...empl};
        let errorMessage: string = '';
        if (newQuant === 1) {
         emplCopy.quantity = quantity + 1;
         } else {
         emplCopy.quantity = quantity - 1;
        }
        emplCopy.sum = emplCopy.price * emplCopy.quantity;
        try {
            await ordersService.updateCartProduct(emplCopy!);
        } catch (error: any) {
            errorMessage = error;
        }
    dispatch(errorMessage, '');
    }
    
    // function getDataGridContent (employees:Employee[], cartProducts:Employee[]):CartItem[] {
        const cartContent: CartItem[] = cartProducts.map(e => {
            const employee = employees.find(el => el.id == e.id);
            return {...e, 
                category: employee?.category,
                name: employee?.name,
                description: employee?.description,
                unit:employee?.unit,
                imageLink:employee?.imageLink,
                price: employee?.price,                
                sum: ((employees.find(el => el.id == e.id)?.price)||0) * (e.quantity||0)}
        });
        let totalSum = cartProducts.length === 0 ? 0: cartContent.map(e => e.sum || 0).reduce((acc,cur) => acc + cur);
        // return res;
    // }

    function createOrderFn():void {
        ordersService.addOrder(cartContent, "Beer-Sheva", "0551112222", totalSum, userData?.email);
        ordersService.clearCart(cartContent);

    }

    return <Box sx={{
        display: 'flex', flexDirection: "column", justifyContent: 'center',
        alignContent: 'center'
    }}>
        <Box sx={{ height: '79vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={orders} />
        </Box>
        <Box sx={{
            height: '10vh', width: '95vw', marginTop: '1vh',
            display: 'flex', flexDirection: "col", justifyContent: 'right',
            alignContent: 'center', gap: '2vw'
        }}>
            {/* <Box sx={{ justifyContent: 'center', alignContent: 'center' }}>
                <div style={{ marginTop: "0.5vh", fontSize: "larger", fontWeight: "bold" }}>
                    Total Sum: {totalSum}
                </div>
            </Box>
            <Button style={{ textAlign: 'center', fontWeight: "bold", fontSize: "larger", justifyContent: 'center', height: '5vh' }}
                onClick={() => createOrderFn()}>Order Now</Button>; */}
        </Box>
        <Confirmation confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeForm submitFn={updateEmployee} employeeUpdated={employee.current} />
            </Box>

        </Modal>
        <Modal
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeCard actionFn={cardAction} employee={employee.current!} />
            </Box>
        </Modal>
    </Box>
}
export default Orders;