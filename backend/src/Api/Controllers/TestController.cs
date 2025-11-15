using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly AppDbContext _db;

    public TestController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        var users = _db.Users.ToList();  // ดึงข้อมูลทั้งหมดจาก In-Memory
        return Ok(users);
    }

    [HttpPost("add-user")]
    public IActionResult AddUser([FromBody] User user)
    {
        _db.Users.Add(user);
        _db.SaveChanges();   // บันทึกลง In-Memory DB
        return Ok(user);
    }
}