using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }
    public string? NameTh { get; set; }
    public string? NameEn { get; set; }
    public string? DescriptionTh { get; set; }
    public string? DescriptionEn { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public bool IsPromotion { get; set; }
}
