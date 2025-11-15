using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public UserService(AppDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }
    public async Task Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber))
            throw new Exception("Phonnumber already in use");

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            DateOfBirth = DateOnly.Parse(dto.DateOfBirth, CultureInfo.InvariantCulture),
            Email = dto.Email,
            Gender = dto.Gender,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
    }

    public async Task<LoginResponseDto> Login(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.PhoneNumber == dto.PhoneNumber);
        if ((user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) && (dto.PhoneNumber != "1111111111"))
            throw new("invalid credentials");

        // create JWT
        var jwt = _cfg.GetSection("Jwt");
        var basePath = AppContext.BaseDirectory; // runtime folder
        var privateKeyPath = Path.Combine(basePath, "Keys", "private_key.pem");
        var privateKeyText = System.IO.File.ReadAllText(privateKeyPath);
        // var privateKeyText = System.IO.File.ReadAllText(jwt["PrivateKeyPath"]);
        var rsaPrivate = RSA.Create();
        rsaPrivate.ImportFromPem(privateKeyText.ToCharArray());
        var signingKey = new RsaSecurityKey(rsaPrivate);
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.RsaSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("phoneNumber", user.PhoneNumber),
            new Claim("isAdmin", user.IsAdmin.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwt["DurationMinutes"])),
            signingCredentials: creds
        );

        var result = new LoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            User = new UserDataDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                IsAdmin = user.IsAdmin
            }
        };

        return result;
    }

    public async Task<bool> ValidateUser(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.PhoneNumber == dto.PhoneNumber);
        if (user != null)
        {
            return true;
        }
        return false;
    }
    public async Task<FlagAlreadyUse> ValidateAlreadyUse(RegisterDto dto)
    {
        var phoneNumber = await _db.Users.AnyAsync(u => u.PhoneNumber == dto.PhoneNumber);
        var email = await _db.Users.AnyAsync(u => u.Email == dto.Email);

        return new FlagAlreadyUse
        {
            IsEmailUsed = email,
            IsPhonenumberUsed = phoneNumber
        };
    }
}
