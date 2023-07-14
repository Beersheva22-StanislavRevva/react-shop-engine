import Employee from "../../model/Employee";
import { EmployeeForm } from "../forms/EmployeeForm";
import InputResult from "../../model/InputResult";
import { authService, employeesService } from "../../config/service-config";

import { useDispatchCode } from "../../hooks/hooks";

const AddEmployee: React.FC = () => {
     let successMessage: string = '';
        let errorMessage = '';
        const dispatch = useDispatchCode();
    async function submitFn(empl: Employee): Promise<InputResult> {
       
        const res: InputResult = {status: 'success', message: ''};
        try {
            const employee: Employee = await employeesService.addEmployee(empl);
            successMessage = `employee with id: ${employee.id} has been added`
        } catch (error: any) {
           errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }
    return <EmployeeForm submitFn={submitFn}/>
}
export default AddEmployee;