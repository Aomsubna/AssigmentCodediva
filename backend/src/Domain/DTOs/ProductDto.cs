public class ProductDto
{
    public string NameTh { get; set; }
    public string NameEn { get; set; }
    public string DescriptionTh { get; set; }
    public string DescriptionEn { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryNameTh { get; set; }
    public string? CategoryNameEn { get; set; }
    public decimal Price { get; set; }
    public bool IsPromotion { get; set; }
    public IFormFile? FileImage { get; set; }
}