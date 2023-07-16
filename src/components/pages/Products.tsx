import { Box,  Button,  Card, CardActions,  CardContent,  CardMedia,  Dialog,  DialogContent,  DialogTitle,  Grid,  Modal, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import Employee from "../../model/Employee";
import { employeesService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { Delete, Details, Edit, Man, Visibility, Woman } from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorEmployees } from "../../hooks/hooks";
import EmployeeCard from "../cards/EmployeeCard";
import UserData from "../../model/UserData";
import { log } from "console";
const columnsCommon: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', flex: 0.3, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'category', headerName: 'Category', flex: 0.4, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'name', headerName: 'Name', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'description', headerName: 'Description', flex: 0.6, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'unit', headerName: 'Unit', flex: 0.4, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'price', headerName: 'Price', type: 'number', flex: 0.4, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'imageLink', headerName: 'Image', flex: 0.9, headerClassName: 'data-grid-header',
        align: 'center', headerAlign: 'center', renderCell: params => {
            return <img src={params.value} alt="product image" width="50vw"/*{params.value}*//>
        }
    },
    // {
    //     field: 'birthDate', headerName: "Date", flex: 0.8, type: 'date', headerClassName: 'data-grid-header',
    //     align: 'center', headerAlign: 'center'
    // },
        
    // {
    //     field: 'gender', headerName: 'Gender', flex: 0.6, headerClassName: 'data-grid-header',
    //     align: 'center', headerAlign: 'center', renderCell: params => {
    //         return params.value == "male" ? <Man/> : <Woman/>
    //     }
    // },
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

const Employees: React.FC = () => {
    const columnsAdmin: GridColDef[] = [
        {
            field: 'actions', type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete />}
                        onClick={() => removeEmployee(params.id)
                        } />,
                    <GridActionsCellItem label="update" icon={<Edit />}
                        onClick={() => {
                            employeeId.current = params.id as any;
                            if (params.row) {
                                const empl = params.row;
                                empl && (employee.current = empl);
                                setFlEdit(true)
                            }
    
                        }
                        } />
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
    const employees = useSelectorEmployees();
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'));
    const columns = useMemo(() => getColumns(), [userData, employees, isPortrait]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openEdit, setFlEdit] = useState(false);
    const [openDetails, setFlDetails] = useState(false);
    const [openProductDetails, setFlProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Employee | null>(null);
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
        if (userData && userData.role == 'admin') {
            res = res.concat(columnsAdmin);
        }
        return res;
    }
    function removeEmployee(id: any) {
        title.current = "Remove Employee object?";
        const employee = employees.find(empl => empl.id == id);
        content.current = `You are going remove employee with id ${employee?.id}`;
        employeeId.current = id;
        confirmFn.current = actualRemove;
        setOpenConfirm(true);
    }
    async function actualRemove(isOk: boolean) {
        let errorMessage: string = '';
        if (isOk) {
            try {
                await employeesService.deleteEmployee(employeeId.current);
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
                await employeesService.updateEmployee(employee.current!);
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
    function getCardButton(userData:UserData): ReactNode {
        let res: ReactNode;
        if (userData && userData.role == 'user') {
            res = <Button style={{textAlign:'center', justifyContent:'center'}}>Add to cart</Button>;
        }
        return res;
    }
    
    return <Box sx={{
        display: 'flex', justifyContent: 'center',
        alignContent: 'center'
    }}>
        {/* <Box sx={{ height: '80vh', width: '95vw' }}>
            <DataGrid columns={columns} rows={employees} />
        </Box> */}
        <Confirmation confirmFn={confirmFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        {/* <Modal
            open={openEdit}
            onClose={() => setFlEdit(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeForm submitFn={updateEmployee} employeeUpdated={employee.current} />
            </Box>
        </Modal> */}
        {/* <Modal
            open={openDetails}
            onClose={() => setFlDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeCard actionFn={cardAction} employee={employee.current!} />
            </Box>
        </Modal> */}
        
        <Grid container spacing={3}>
            {employees.map(e =>
                <Grid item xs={6} sm={3} lg={2} key={e.id}>
                    <Card sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center', }}
                        onClick={() => setSelectedProduct(e)} >
                        <CardMedia
                            height='200'
                            component="img"
                            src={e.imageLink}
                            alt="Producth"
                            sx={{ objectFit: 'contain' }}
                        />
                        <CardContent>
                            <Typography variant="h5" color="text.secondary" textAlign="center">
                                {e.price} -
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                {e.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                {e.category}  {e.unit}
                            </Typography>
                            {getCardButton(userData)}
                        </CardContent>
                    </Card>
                </Grid>)}
        </Grid>
        {/* <Modal
            open={openProductDetails}
            onClose={() => setFlProductDetails(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <EmployeeCard actionFn={cardProductAction} employee={employee.current!} />
            </Box>
        </Modal> */}
        <Modal open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            
            <Card sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                         >
                <CardMedia
                    component="img"
                    alt={selectedProduct?.name}
                    height="500"
                    image={selectedProduct?.imageLink}
                    sx={{ objectFit: 'contain' }}
                />
                 <CardContent sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant="h5" color="text.secondary">
                            {selectedProduct?.category} {selectedProduct?.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                               {selectedProduct?.description}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedProduct?.unit}
                            </Typography>
                            <Typography variant="h5" color="text.secondary">
                                price:{selectedProduct?.price} -
                            </Typography>
                            {getCardButton(userData)}
                        </CardContent>
            </Card>    
            </Modal>
    </Box>
}
export default Employees;