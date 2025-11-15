using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    [Required] public string? PhoneNumber { get; set; }
    [Required] public string? PasswordHash { get; set; } // store hashed password
    public string? Email { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public bool IsAdmin { get; set; } = false;
}
