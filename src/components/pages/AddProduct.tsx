import Product from "../../model/Product";
import { ProductForm } from "../forms/ProductForm";
import InputResult from "../../model/InputResult";
import { authService, productService as productService } from "../../config/service-config";

import { useDispatchCode } from "../../hooks/hooks";

const AddProduct: React.FC = () => {
    let successMessage: string = '';
    let errorMessage = '';
    const dispatch = useDispatchCode();
    async function submitFn(empl: Product): Promise<InputResult> {

        const res: InputResult = { status: 'success', message: '' };
        try {
            const product: Product = await productService.addProduct(empl);
            successMessage = `employee with id: ${product.id} has been added`
        } catch (error: any) {
            errorMessage = error;
        }
        dispatch(errorMessage, successMessage);
        return res;
    }
    return <ProductForm submitFn={submitFn} />
}
export default AddProduct;