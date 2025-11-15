using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
// [Authorize(JwtBearerDefaults.AuthenticationScheme)]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("getCategory")]
    public async Task<IActionResult> GetCategory()
    {
        return Ok(await _productService.GetCategory());
    }

    [HttpGet("getProduct")]
    public async Task<IActionResult> GetProduct()
    {
        return Ok(await _productService.GetProduct());
    }

    [HttpPost("addProduct")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> AddProduct([FromForm] ProductDto product)
    {
        await _productService.AddProduct(product);
        return Ok(new { message = "Product added successfully" });
    }
}