import { useTheme } from "@mui/material/styles";
import { RouteType } from "./Navigator"
import { useMediaQuery } from "@mui/material";
import Navigator from "./Navigator";
import NavigatorPortrait from "./NavigatorPortrait";

const NavigatorDispatcher: React.FC<{routes: RouteType[]}> = ({routes}) => {
    const theme = useTheme();
    const isPortrait = useMediaQuery(theme.breakpoints.down('md'));
    return !isPortrait ? <Navigator routes={routes}/> : <NavigatorPortrait routes={routes}/>
}
export default NavigatorDispatcher