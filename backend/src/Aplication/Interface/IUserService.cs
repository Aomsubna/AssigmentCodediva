public interface IUserService
{
    Task Register(RegisterDto dto);
    Task<LoginResponseDto> Login(LoginDto dto);
    Task<bool> ValidateUser(LoginDto loginDto);
    Task<FlagAlreadyUse> ValidateAlreadyUse(RegisterDto dto);
}