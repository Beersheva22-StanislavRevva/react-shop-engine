type Employee  = {
    id?: any,
    age?: number,
    //birthDate: Date,
    name: string,
    category: string,
    price: number,
    description: string,
    unit: string,
    imageLink: string,
    //gender: 'male' | 'female'
    quantity?:number,
    serial?:number


}
export default Employee;