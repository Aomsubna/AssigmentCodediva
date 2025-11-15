public interface IProductService
{
    Task<List<Category>> GetCategory();
    Task<List<Product>> GetProduct();
    Task AddProduct(ProductDto product);
}