public class LoginResponseDto
{
    public string Token { get; set; }
    public UserDataDto User { get; set; }
}

public class UserDataDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public bool IsAdmin { get; set; }
}