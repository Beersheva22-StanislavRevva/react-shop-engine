import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import Employee from "../../model/Employee"
import { useSelectorAuth } from "../../redux/store";
import { getISODateStr } from "../../util/date-functions";
type Props = {
    employee: Employee;
    actionFn: (isDelete: boolean) => void
}
const EmployeeCard: React.FC<Props> = ({employee, actionFn}) => {
    const userData = useSelectorAuth();
    
      return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent> 
          <Typography variant="h6" ml={7}>
                   id: {employee.id}
              </Typography>
              <Typography variant="h5" ml={7} >
                   name: {employee.name}
              </Typography>
              {/* <Typography variant="h5" ml={7} >
                   birthDate: {getISODateStr(employee.birthDate)}
              </Typography> */}
              <Typography variant="h6" ml={7} >
                   category: {employee.category}
              </Typography>
              <Typography variant="h6" ml={7} >
                   price: {employee.price} unit: {employee.unit}
              </Typography>
              <Typography variant="body1" ml={7}>
                   description: {employee.description}
              </Typography>
              </CardContent>
         { userData && userData.role=="admin" && <CardActions>
            <Button size="small"onClick={() =>actionFn(false) }>Update</Button>
            <Button size="small" onClick={() =>actionFn(true)}>Delete</Button>
          </CardActions>}
        </Card>
      );
    }
    export default EmployeeCard;