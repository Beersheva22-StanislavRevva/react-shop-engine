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
          <Typography variant="h5" ml={7}>
                   id: {employee.id}
              </Typography>
              <Typography variant="h5" ml={7} >
                   name: {employee.name}
              </Typography>
              {/* <Typography variant="h5" ml={7} >
                   birthDate: {getISODateStr(employee.birthDate)}
              </Typography> */}
              <Typography variant="h5" ml={7} >
                   department: {employee.category}
              </Typography>
              <Typography variant="h5" ml={7} >
                   salary: {employee.price}
              </Typography>
              {/* <Typography variant="h5" ml={7}>
                   gender: {employee.gender}
              </Typography> */}
          </CardContent>
         { userData && userData.role=="admin" && <CardActions>
            <Button size="small"onClick={() =>actionFn(false) }>Update</Button>
            <Button size="small" onClick={() =>actionFn(true)}>Delete</Button>
          </CardActions>}
        </Card>
      );
    }
    export default EmployeeCard;