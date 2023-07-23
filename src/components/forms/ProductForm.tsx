import React, { useRef, useState } from "react";
import { FormControl, Grid, TextField, InputLabel, Select, Box, MenuItem, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Snackbar, Alert } from '@mui/material';
import Product from "../../model/Product";
import productsConfig from "../../config/product-config.json"
import InputResult from "../../model/InputResult";
import { StatusType } from "../../model/StatusType";
type Props = {
    submitFn: (prod: Product) => Promise<InputResult>,
    productUpdated?: Product

}
const initialDate: any = 0;
const initialGender: any = '';
const initialProduct: Product = {
    id: 0,
    name: '',
    category: '',
    price: 0,
    description: '',
    unit:'',
    imageLink: ''
};
export const ProductForm: React.FC<Props> = ({ submitFn, productUpdated: productUpdated }) => {
    const { minYear, minPrice: minPrice, maxYear, maxPrice: maxPrice, category:category, unit:unit}
        = productsConfig;
    const [product, setProduct] =
        useState<Product>(productUpdated || initialProduct);
        const [errorMessage, setErrorMessage] = useState('');
    function handlerName(event: any) {
        const name = event.target.value;
        const prodCopy = { ...product };
        prodCopy.name = name;
        setProduct(prodCopy);
    }
    function handlerDescription(event: any) {
        const description = event.target.value;
        const prodCopy = { ...product };
        prodCopy.description = description;
        setProduct(prodCopy);
    }
    function handlerImageLink(event: any) {
        const imageLink = event.target.value;
        const prodCopy = { ...product };
        prodCopy.imageLink = imageLink;
        setProduct(prodCopy);
    }
    function handlerPrice(event: any) {
        const price: number = +event.target.value;
        const prodCopy = { ...product };
        prodCopy.price = price;
        setProduct(prodCopy);
    }
    function handlerCategory(event: any) {
        const category = event.target.value;
        const prodCopy = { ...product };
        prodCopy.category = category;
        setProduct(prodCopy);
    }
    function handlerUnit(event: any) {
        const unit = event.target.value;
        const prodCopy = { ...product };
        prodCopy.unit = unit;
        setProduct(prodCopy);
    }
    
    async function onSubmitFn(event: any) {
        event.preventDefault();
             const res =  await submitFn(product);      
             res.status == "success" && event.target.reset();    
    }
    function onResetFn(event: any) {
        setProduct(productUpdated || initialProduct);
    }

    return <Box sx={{ marginTop: { sm: "25vh" } }}>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-department-id">Category</InputLabel>
                        <Select labelId="select-department-id" label="Category"
                            value={product.category} onChange={handlerCategory}>
                            <MenuItem value=''>None</MenuItem>
                            {category.map(dep => <MenuItem value={dep} key={dep}>{dep}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Product name"
                        helperText="enter Product name" onChange={handlerName}
                        value={product.name} />
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Description"
                        helperText="enter Product description" onChange={handlerDescription}
                        value={product.description} />
                </Grid>
                <Grid item xs={8} sm={5} >
                    <FormControl fullWidth required>
                        <InputLabel id="select-unit-id">Unit</InputLabel>
                        <Select labelId="select-unit-id" label="Unit"
                            value={product.unit} onChange={handlerUnit}>
                            <MenuItem value=''>None</MenuItem>
                            {unit.map(unit => <MenuItem value={unit} key={unit}>{unit}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8} sm={5} >
                    <TextField type="text" required fullWidth label="Image link"
                        helperText="enter Image link" onChange={handlerImageLink}
                        value={product.imageLink} />
                </Grid>
                <Grid item xs={8} sm={4} md={5} >
                    <TextField label="price" fullWidth required
                        type="number" onChange={handlerPrice}
                        value={product.price || ''}
                        helperText={`enter price in range [${minPrice}-${maxPrice}]`}
                        inputProps={{
                            min: `${minPrice }`,
                            max: `${maxPrice }`
                        }} />
                </Grid>
            </Grid>
            <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                <Button type="submit" >Submit</Button>
                <Button type="reset">Reset</Button>
            </Box>
        </form>
       
    </Box>
}