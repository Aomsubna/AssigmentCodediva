
using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;
    public ProductService(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }
    public async Task AddProduct(ProductDto product)
    {
        if (!await _db.Categorys.AnyAsync(i => i.Id == product.CategoryId))
        {
            await _db.Categorys.AddAsync(new Category
            {
                Id = product.CategoryId,
                CategoryNameTh = product.CategoryNameTh,
                CategoryNameEn = product.CategoryNameEn
            });
        }
        ;

        string? imageUrl = product.ImageUrl;
        if (product.FileImage != null && product.FileImage.Length > 0)
        {

            var uploadsPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(product.FileImage.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await product.FileImage.CopyToAsync(stream);


            imageUrl = $"/images/{fileName}";
        }

        var lastId = await _db.Products
            .OrderByDescending(p => p.Id)
            .Select(p => (int?)p.Id)
            .FirstOrDefaultAsync();

        var newProductId = (lastId ?? 0) + 1;

        await _db.Products.AddAsync(new Product
        {
            Id = newProductId,
            NameTh = product.NameTh,
            NameEn = product.NameEn,
            DescriptionTh = product.DescriptionTh,
            DescriptionEn = product.DescriptionEn,
            ImageUrl = imageUrl,
            CategoryId = product.CategoryId,
            Price = product.Price,
            IsPromotion = product.IsPromotion
        });
        await _db.SaveChangesAsync();
    }

    public async Task<List<Product>> GetProduct()
    {
        return await _db.Products.ToListAsync();
    }

    public async Task<List<Category>> GetCategory()
    {
        return await _db.Categorys.ToListAsync();
    }


}