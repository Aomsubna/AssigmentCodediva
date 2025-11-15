using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // private readonly AppDbContext _db;
    // private readonly IConfiguration _cfg;
    private readonly IUserService _userService;
    // public AuthController(AppDbContext db, IConfiguration cfg) { _db = db; _cfg = cfg; }
    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        await _userService.Register(dto);
        return Ok(new { message = "registered" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        return Ok(await _userService.Login(dto));
    }

    [HttpPost("validateUser")]
    public async Task<IActionResult> ValidateUser(LoginDto dto)
    {
        return Ok(await _userService.ValidateUser(dto));
    }

    [HttpPost("validateAlreadyUse")]
    public async Task<IActionResult> ValidateAlreadyUse(RegisterDto dto)
    {
        return Ok(await _userService.ValidateAlreadyUse(dto));
    }
}
