import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Employee from "../../model/Employee";
import employeeConfig from "../../config/employee-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
type Props = {
    submitFn: (empl: Employee) => Promise<InputResult>,
    employeeUpdated?: Employee

}
const initialDate: any = 0;
const initialGender: any = '';
const initialEmployee: Employee = {
    id: 0, /*birthDate: initialDate,*/ name: '',category: '', price: 0,
     /*gender: initialGender*/
};
export const EmployeeForm: React.FC<Props> = ({ submitFn, employeeUpdated }) => {
    const { minYear, minPrice: minPrice, maxYear, maxPrice: maxPrice, category}
        = employeeConfig;
    const [employee, setEmployee] =
        useState<Employee>(employeeUpdated || initialEmployee);
        const [errorMessage, setErrorMessage] = useState('');
    function handlerName(event: any) {
        const name = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.name = name;
        setEmployee(emplCopy);
    }
    // function handlerBirthdate(event: any) {
    //     const birthDate = event.target.value;
    //     const emplCopy = { ...employee };
    //     emplCopy.birthDate = new Date(birthDate);
    //     setEmployee(emplCopy);
    // }
    function handlerSalary(event: any) {
        const salary: number = +event.target.value;
        const emplCopy = { ...employee };
        emplCopy.price = salary;
        setEmployee(emplCopy);
    }
    function handlerDepartment(event: any) {
        const department = event.target.value;
        const emplCopy = { ...employee };
        emplCopy.category = department;
        setEmployee(emplCopy);
    }
    // function genderHandler(event: any) {
    //     setErrorMessage('');
    //     const gender:'male'|'female' = event.target.value;
    //     const emplCopy = { ...employee };
    //     emplCopy.gender = gender;
    //     setEmployee(emplCopy);
    // }
    async function onSubmitFn(event: any) {
        event.preventDefault();
        // if(!employee.gender) {
        //     setErrorMessage("Please select gender")
        // } else {
             const res =  await submitFn(employee);
             
             
             res.status == "success" && event.target.reset();
            
        /*}*/
       
        
    }
    function onResetFn(event: any) {
        setEmployee(employeeUpdated || initialEmployee);
    }

    return <Box sx={{ marginTop: { sm: "25vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-department-id">Category</InputLabel>
                        <Select labelId="select-department-id" label="Category"
                            value={employee.category} onChange={handlerDepartment}>
                            <MenuItem value=''>None</MenuItem>
                            {category.map(dep => <MenuItem value={dep} key={dep}>{dep}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Product name"
                        helperText="enter Product name" onChange={handlerName}
                        value={employee.name} />
                </Grid>
                {/* <Grid item xs={8} sm={4} md={5}>
                    <TextField type="date" required fullWidth label="birthDate"
                        value={employee.birthDate ? employee.birthDate.toISOString()
                            .substring(0, 10) : ''} inputProps={{
                                readOnly: !!employeeUpdated,
                            min: `${minYear}-01-01`,
                            max: `${maxYear}-12-31`
                        }} InputLabelProps={{
                            shrink: true
                        }} onChange={handlerBirthdate} />
                </Grid> */}
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="price" fullWidth required
                        type="number" onChange={handlerSalary}
                        value={employee.price || ''}
                        helperText={`enter price in range [${minPrice}-${maxPrice}]`}
                        inputProps={{
                            min: `${minPrice }`,
                            max: `${maxPrice }`
                        }} />
                </Grid>
                {/* <Grid item xs={8} sm={4} md={5}>
                    <FormControl required error={!!errorMessage}>
                        <FormLabel id="gender-group-label">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="gender-group-label"
                            defaultValue=""
                            value={employee.gender || ''}
                            name="radio-buttons-group"
                           row onChange={genderHandler}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" disabled = {!!employeeUpdated} />
                            <FormControlLabel value="male" control={<Radio />} label="Male" disabled = {!!employeeUpdated}/>
                            <FormHelperText>{errorMessage}</FormHelperText>
                        </RadioGroup>
                    </FormControl>
                </Grid> */}
            </Grid>




            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>



        </form>
       
    </Box>
}