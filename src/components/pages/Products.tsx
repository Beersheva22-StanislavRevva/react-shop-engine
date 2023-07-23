import { Box,  Button,  Card, CardActions,  CardContent,  CardMedia,  Dialog,  DialogContent,  DialogTitle,  FormControl,  Grid,  IconButton,  InputLabel,  MenuItem,  Modal, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import Employee from "../../model/Employee";
import { employeesService,ordersService } from "../../config/service-config";
import { Subscription } from 'rxjs';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Details, Edit, Man, Visibility, Woman, AddShoppingCartOutlined, RemoveShoppingCartOutlined, ArrowUpwardOutlined, ArrowDownwardOutlined} from "@mui/icons-material";
import { useSelectorAuth } from "../../redux/store";
import { Confirmation } from "../common/Confirmation";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { useDispatchCode, useSelectorCart, useSelectorEmployees, useSort } from "../../hooks/hooks";
import EmployeeCard from "../cards/EmployeeCard";
import UserData from "../../model/UserData";
import { log } from "console";
import OrdersServiceFire from "../../service/crud/OrdersServiceFire";
import employeeConfig from "../../config/employee-config.json"

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

const categories:string[] = employeeConfig.category;

const Products: React.FC = () => {
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
    const [buttonFl, setButtonFl] = useState<boolean>(false);
    const title = useRef('');
    const content = useRef('');
    const employeeId = useRef('');
    const confirmFn = useRef<any>(null);
    const employee = useRef<Employee | undefined>();
    const cartProducts = useSelectorCart();
    
    
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
    function getCardIncButton(userData:UserData, employee:Employee|null): ReactNode {
        let res: ReactNode;
        if (userData && userData.role == 'user') {
            res = <IconButton style={{textAlign:'center', justifyContent:'center'}} 
            onClick={() => ordersService.addProdToCart(employee, userData.email, 1)}
            aria-label="add to cart" ><AddShoppingCartOutlined/></IconButton>;
            
        }
        return res;
    }
    function getCardDecButton(userData:UserData, employee:Employee|null): ReactNode {
        let res: ReactNode;
        if (userData && userData.role == 'user') {
            if (cartProducts.find(el=> el.id == employee?.id)?.quantity === 1) {
                res = <IconButton style={{textAlign:'center', justifyContent:'center'}} 
                onClick={() => {
                    ordersService.deleteCartProduct(employee?.id);
                }}
                disabled = {buttonFl}
                aria-label="remove from cart" ><RemoveShoppingCartOutlined/></IconButton>
            } else{ 
                    res = <IconButton style={{textAlign:'center', justifyContent:'center'}}
                 onClick={() => ordersService.addProdToCart(employee, userData.email, -1)}
                aria-label="remove from cart" ><RemoveShoppingCartOutlined/></IconButton>;
            }
            if (!cartProducts.find(el=> el.id == employee?.id)?.quantity) {
                res = <IconButton style={{textAlign:'center', justifyContent:'center'}}
                disabled
               aria-label="remove from cart" ><RemoveShoppingCartOutlined/></IconButton>;
            }

        }
        return res;
    }
    
    
    const[currentCategory, setCurrentCategory] = useState('all');
    const[minPrice, setMinPrice] = useState<number>();
    const[maxPrice, setMaxPrice] = useState<number>();
    let handlerCategory = (event:any) => {
      let currentCategoryhandler = event.target.value;
       setCurrentCategory(currentCategoryhandler);
    }
    let employeesFilter = currentCategory == 'all' ? employees
    : employees.filter(e => e.category == currentCategory);
       
    let handlerMinPrice = (event:any) => {
        let currentMinPrice = event.target.value;
        setMinPrice(currentMinPrice);
    }
    if(minPrice && minPrice > 0) {
        employeesFilter = employeesFilter.filter(e => e.price >= minPrice)
    } 
    
    let handlerMaxPrice = (event:any) => {
        let currentMaxPrice = event.target.value;
        setMaxPrice(currentMaxPrice);
    }
    if(maxPrice && maxPrice > 0) {
        employeesFilter = employeesFilter.filter(e => e.price <= maxPrice)
    }

    const [sortIncFl, setIncSortFl] = useState<boolean>(false);

   if (sortIncFl) {
    employeesFilter = employeesFilter.sort((a, b) => {
                    if (a.price > b.price) {
                        return 1;
                    }
                    if (a.price < b.price) {
                        return -1;
                    }
                    return 0;
                });
                setIncSortFl(false);
    }

    const [sortDecFl, setDecSortFl] = useState<boolean>(false);

    if (sortDecFl) {
        employeesFilter = employeesFilter.sort((a, b) => {
                        if (a.price > b.price) {
                            return -1;
                        }
                        if (a.price < b.price) {
                            return 1;
                        }
                        return 0;
                    });
                    setDecSortFl(false);
        }

    
    return <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignContent: 'center', margin: '0.5vw'
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

        <Box width = '95vw' margin=''>
            {/* <Typography variant="body1" color="text.secondary" textAlign="center" margin="1vw">
                Filter</Typography> */}
        <Grid container spacing={2} justifyContent="left" display="flex" flexDirection="row">
            <Grid item xs={2} sm={2} >
                <FormControl required fullWidth  >
                    <InputLabel id="select-unit-id">Category</InputLabel>
                    <Select labelId="select-unit-id" label="Status"
                       onChange={handlerCategory} defaultValue='all' >
                        <MenuItem value='all' key="all">all</MenuItem>
                        {categories.map(e => <MenuItem value={e} key={e}>{e}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3} sm={3} md={2} >
                <TextField label="min price" 
                    type="number" onChange={handlerMinPrice}
                    helperText={`enter min price `}
                    inputProps={{
                        min: 0
                        
                    }} />
            </Grid>
            <Grid item xs={3} sm={3} md={2} >
                <TextField label="max price" 
                    type="number" onChange={handlerMaxPrice}
                    helperText={`enter max price `}
                    inputProps={{
                       min: 1,                    
                    }} />
            </Grid>
            <Grid item xs={4} sm={4} md={4} display="flex" flexDirection="row" gap='2vw' >
                <Button variant="outlined" startIcon={<ArrowUpwardOutlined />} style={{height:'8.5vh'}}  onClick={()=> setIncSortFl(true)}> Price Filter</Button> 
                <Button variant="outlined" startIcon={<ArrowDownwardOutlined />} style={{height:'8.5vh'}} onClick={()=> setDecSortFl(true)}> Price Filter</Button>
            </Grid>
        </Grid>
            {/* <Grid item xs={8} sm={4} md={5} >
                <TextField label="min price" fullWidth
                    type="number" onChange={handlerMaxPrice}
                    helperText={`enter contact phone (from 0) `}
                    inputProps={{
                        minlength: '10',
                        maxlength: '11'
                    }} />
            </Grid> */}

        </Box>
        <Grid container spacing={3} marginTop='2vh'>
            {employeesFilter.map(e =>
                <Grid item xs={6} sm={3} lg={2} key={e.id}>
                    <Card sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center', }}
                    >
                        <div onClick={() => setSelectedProduct(e)}>
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
                            </CardContent>
                        </div>
                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '1vh' }}>
                            {getCardIncButton(userData, e)}
                            <div style={{ marginTop: "0.5vh", fontSize: "larger", fontWeight: "bold" }}>
                                {cartProducts.find(el => el.id == e.id)?.quantity}
                            </div>
                            {getCardDecButton(userData, e)}
                        </Box>
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

            <Card sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <CardMedia
                    component="img"
                    alt={selectedProduct?.name}
                    height="500"
                    image={selectedProduct?.imageLink}
                    sx={{ objectFit: 'scale-down' }}

                />
                <div onClick={() => setSelectedProduct(selectedProduct)}>
                    <CardContent sx={{ maxWidth: '100', maxHeight: '200', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    </CardContent>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '1vh' }}>
                    {getCardIncButton(userData, selectedProduct)}
                    <div style={{ marginTop: "0.5vh", fontSize: "larger", fontWeight: "bold" }}>
                        {cartProducts.find(el => el.id == selectedProduct?.id)?.quantity}
                    </div>
                    {getCardDecButton(userData, selectedProduct)}
                </Box>
            </Card>
        </Modal>
    </Box>
}
export default Products;