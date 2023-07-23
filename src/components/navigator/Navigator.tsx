import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom'
//import shopLogo from 'images/shoplogo.png'
export type RouteType = {
  order: any;
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({routes}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);
    useEffect(() => {
        let index = routes.findIndex(r=>r.to === location.pathname)
        if (index < 0 ) {
            index = 0;
        }
        navigate(routes[index].to);
        setValue(index);
    }, [routes])
    function onChangeFn(event:any, newValue:number) {
        setValue(newValue);
    }
    function getTabs(): ReactNode {
        return routes.map(r=><Tab component={NavLink} to={r.to} label={r.label} key={r.label} />)
    }

    
    return <Box mt={10}>
        <AppBar >
            <Tabs value={value <routes.length ? value : 0} onChange={onChangeFn} style={{backgroundColor:'#ffe5e5', }}>
                {getTabs()}       
            </Tabs>
        </AppBar>
        <Box display="flex" flexDirection="row" justifyContent="center" alignContent="center" marginBottom='2vh'>
        <Box width='10vw' >
            <img src="/images/shoplogo.png" alt="" width="80%" />
        </Box>
        <Typography variant='h2' color='gray' alignContent='center'>DIONIS CLUB</Typography>
        </Box>
        <Outlet></Outlet>
        
    </Box>
}
export default Navigator;