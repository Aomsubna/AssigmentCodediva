using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("DbInMemory"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var basePath = AppContext.BaseDirectory; // runtime folder
var publicKeyPath = Path.Combine(basePath, "Keys", "public_key.pem");
var publicKeyText = System.IO.File.ReadAllText(publicKeyPath);
var jwt = builder.Configuration.GetSection("Jwt");
// var publicKeyText = System.IO.File.ReadAllText(jwt["PublicKeyPath"]);
using var rsaPublic = RSA.Create();
rsaPublic.ImportFromPem(publicKeyText.ToCharArray());
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new RsaSecurityKey(rsaPublic)
    };
});
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User { FirstName = "Admin", LastName = "User", Email = "admin@gmail.com", PhoneNumber = "1111111111", DateOfBirth = DateOnly.Parse("1990-01-01"), Gender = "Null", PasswordHash = "$2a$11$A/JwqP5u4Yx2M9fQmN7T1OMCOrMymEw7K4AZijBMKZtIYHhx.d96i", IsAdmin = true }
        );
        db.SaveChanges();
    }
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { NameTh = "สินค้าที่ 1", NameEn = "Item 1", Price = 79, CategoryId = 1, ImageUrl = "/images/641769.png" },
            new Product { NameTh = "สินค้าที่ 2", NameEn = "Item 2", Price = 89, CategoryId = 2, ImageUrl = "/images/500641706.png" },
            new Product { NameTh = "สินค้าที่ 3", NameEn = "Item 3", Price = 99, CategoryId = 3, ImageUrl = "/images/1529_1.png" },
            new Product { NameTh = "สินค้าที่ 4", NameEn = "Item 4", Price = 79, CategoryId = 1, ImageUrl = "/images/500641707.png" },
            new Product { NameTh = "โปรโมชั่น 1", NameEn = "Promotion 1", Price = 89, ImageUrl = "/images/636250.png", IsPromotion = true },
            new Product { NameTh = "โปรโมชั่น 2", NameEn = "Promotion 2", Price = 99, ImageUrl = "/images/500636094.png", IsPromotion = true },
            new Product { NameTh = "โปรโมชั่น 3", NameEn = "Promotion 3", Price = 99, ImageUrl = "/images/500636116_1.png", IsPromotion = true }
        );
        db.SaveChanges();
    }
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Categorys.Any())
    {
        db.Categorys.AddRange(
            new Category { Id = 1, CategoryNameTh = "หมวดหมู่ที่ 1", CategoryNameEn = "Category 1" },
            new Category { Id = 2, CategoryNameTh = "หมวดหมู่ที่ 2", CategoryNameEn = "Category 2" },
            new Category { Id = 3, CategoryNameTh = "หมวดหมู่ที่ 3", CategoryNameEn = "Category 3" }
        );
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();
app.Run();
