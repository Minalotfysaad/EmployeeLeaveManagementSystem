using FluentAssertions;
using FluentValidation.TestHelper;
using Leavo.Application.DTOs.Auth;
using Leavo.Application.DTOs.Balance;
using Leavo.Application.DTOs.Department;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.Employee.Validators;
using Leavo.Application.DTOs.Holiday;
using Leavo.Application.DTOs.LeaveRequest;
using Leavo.Application.DTOs.LeaveType;
using Leavo.Application.Validators;
using Leavo.Application.Validators.Auth;
using Leavo.Application.Validators.Balance;
using Leavo.Application.Validators.Department;
using Leavo.Application.Validators.Holiday;
using Leavo.Application.Validators.LeaveRequest;
using Leavo.Application.Validators.LeaveType;
using Xunit;

namespace Leavo.Application.Tests.Validators;

public class ValidatorsTests
{
    // ============================================================
    // UpdateEmployeeDtoValidator
    // ============================================================

    [Fact]
    public void UpdateEmployee_ShouldPass_WhenDataIsValid()
    {
        var dto = new UpdateEmployeeDto
        {
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new UpdateEmployeeDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateEmployee_ShouldFail_WhenFirstNameIsEmpty()
    {
        var dto = new UpdateEmployeeDto
        {
            FirstName = "",
            LastName = "Doe"
        };

        var validator = new UpdateEmployeeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void UpdateEmployee_ShouldFail_WhenLastNameIsEmpty()
    {
        var dto = new UpdateEmployeeDto
        {
            FirstName = "John",
            LastName = ""
        };

        var validator = new UpdateEmployeeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Fact]
    public void UpdateEmployee_ShouldFail_WhenFirstNameExceeds50Characters()
    {
        var dto = new UpdateEmployeeDto
        {
            FirstName = new string('A', 51),
            LastName = "Doe"
        };

        var validator = new UpdateEmployeeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void UpdateEmployee_ShouldFail_WhenLastNameExceeds50Characters()
    {
        var dto = new UpdateEmployeeDto
        {
            FirstName = "John",
            LastName = new string('A', 51)
        };

        var validator = new UpdateEmployeeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    // ============================================================
    // LoginRequestDtoValidator
    // ============================================================

    [Fact]
    public void Login_ShouldPass_WhenDataIsValid()
    {
        var dto = new LoginRequestDto
        {
            Email = "john@example.com",
            Password = "Password123!"
        };

        var validator = new LoginRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Login_ShouldFail_WhenEmailIsEmpty()
    {
        var dto = new LoginRequestDto
        {
            Email = "",
            Password = "Password123!"
        };

        var validator = new LoginRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Login_ShouldFail_WhenEmailIsInvalid()
    {
        var dto = new LoginRequestDto
        {
            Email = "invalid-email",
            Password = "Password123!"
        };

        var validator = new LoginRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Login_ShouldFail_WhenPasswordIsEmpty()
    {
        var dto = new LoginRequestDto
        {
            Email = "john@example.com",
            Password = ""
        };

        var validator = new LoginRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    // ============================================================
    // RegisterRequestDtoValidator
    // ============================================================

    [Fact]
    public void Register_ShouldPass_WhenDataIsValid()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Register_ShouldFail_WhenEmailIsInvalid()
    {
        var dto = new RegisterRequestDto
        {
            Email = "invalid-email",
            Password = "Password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Register_ShouldFail_WhenPasswordIsTooShort()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Pass1!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Register_ShouldFail_WhenPasswordHasNoUppercase()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "password123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Register_ShouldFail_WhenPasswordHasNoLowercase()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "PASSWORD123!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Register_ShouldFail_WhenPasswordHasNoNumber()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Password!",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Register_ShouldFail_WhenPasswordHasNoSpecialCharacter()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Password123",
            FirstName = "John",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Register_ShouldFail_WhenFirstNameIsEmpty()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Password123!",
            FirstName = "",
            LastName = "Doe"
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Register_ShouldFail_WhenLastNameIsEmpty()
    {
        var dto = new RegisterRequestDto
        {
            Email = "john@example.com",
            Password = "Password123!",
            FirstName = "John",
            LastName = ""
        };

        var validator = new RegisterRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    // ============================================================
    // UpdateBalanceDtoValidator
    // ============================================================

    [Fact]
    public void UpdateBalance_ShouldPass_WhenRemainingDaysIsValid()
    {
        var dto = new UpdateBalanceDto
        {
            RemainingDays = 10
        };

        var validator = new UpdateBalanceDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateBalance_ShouldPass_WhenRemainingDaysIsZero()
    {
        var dto = new UpdateBalanceDto
        {
            RemainingDays = 0
        };

        var validator = new UpdateBalanceDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateBalance_ShouldFail_WhenRemainingDaysIsNegative()
    {
        var dto = new UpdateBalanceDto
        {
            RemainingDays = -1
        };

        var validator = new UpdateBalanceDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.RemainingDays);
    }

    // ============================================================
    // CreateDepartmentDtoValidator
    // ============================================================

    [Fact]
    public void CreateDepartment_ShouldPass_WhenDataIsValid()
    {
        var dto = new CreateDepartmentDto
        {
            Name = "Engineering"
        };

        var validator = new CreateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateDepartment_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new CreateDepartmentDto
        {
            Name = ""
        };

        var validator = new CreateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void CreateDepartment_ShouldFail_WhenNameExceeds100Characters()
    {
        var dto = new CreateDepartmentDto
        {
            Name = new string('A', 101)
        };

        var validator = new CreateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    // ============================================================
    // UpdateDepartmentDtoValidator
    // ============================================================

    [Fact]
    public void UpdateDepartment_ShouldPass_WhenDataIsValid()
    {
        var dto = new UpdateDepartmentDto
        {
            Name = "Engineering"
        };

        var validator = new UpdateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateDepartment_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new UpdateDepartmentDto
        {
            Name = ""
        };

        var validator = new UpdateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void UpdateDepartment_ShouldFail_WhenNameExceeds100Characters()
    {
        var dto = new UpdateDepartmentDto
        {
            Name = new string('A', 101)
        };

        var validator = new UpdateDepartmentDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    // ============================================================
    // CreateHolidayDtoValidator
    // ============================================================

    [Fact]
    public void CreateHoliday_ShouldPass_WhenDataIsValid()
    {
        var startDate = DateTime.Today;
        var endDate = startDate.AddDays(2);

        var dto = new CreateHolidayDto
        {
            Name = "Eid Holiday",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new CreateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateHoliday_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new CreateHolidayDto
        {
            Name = "",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today
        };

        var validator = new CreateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void CreateHoliday_ShouldFail_WhenStartDateIsEmpty()
    {
        var dto = new CreateHolidayDto
        {
            Name = "Holiday",
            EndDate = DateTime.Today
        };

        var validator = new CreateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.StartDate);
    }

    [Fact]
    public void CreateHoliday_ShouldFail_WhenEndDateIsBeforeStartDate()
    {
        var startDate = DateTime.Today;
        var endDate = startDate.AddDays(-1);

        var dto = new CreateHolidayDto
        {
            Name = "Holiday",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new CreateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    // ============================================================
    // UpdateHolidayDtoValidator
    // ============================================================

    [Fact]
    public void UpdateHoliday_ShouldPass_WhenDataIsValid()
    {
        var startDate = DateTime.Today;
        var endDate = startDate.AddDays(2);

        var dto = new UpdateHolidayDto
        {
            Name = "Eid Holiday",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new UpdateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateHoliday_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new UpdateHolidayDto
        {
            Name = "",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today
        };

        var validator = new UpdateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void UpdateHoliday_ShouldFail_WhenEndDateIsBeforeStartDate()
    {
        var startDate = DateTime.Today;
        var endDate = startDate.AddDays(-1);

        var dto = new UpdateHolidayDto
        {
            Name = "Holiday",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new UpdateHolidayDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    // ============================================================
    // CreateLeaveRequestDtoValidator
    // ============================================================

    [Fact]
    public void CreateLeaveRequest_ShouldPass_WhenDataIsValid()
    {
        var startDate = DateOnly.FromDateTime(DateTime.Today);

        var endDate = startDate.AddDays(2);

        var dto = new CreateLeaveRequestDto
        {
            LeaveTypeId = Guid.NewGuid(),
            Reason = "Vacation",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new CreateLeaveRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateLeaveRequest_ShouldFail_WhenLeaveTypeIdIsEmpty()
    {
        var dto = new CreateLeaveRequestDto
        {
            LeaveTypeId = Guid.Empty,
            Reason = "Vacation",
            StartDate = DateOnly.FromDateTime(DateTime.Today),
            EndDate = DateOnly.FromDateTime(DateTime.Today)
        };

        var validator = new CreateLeaveRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.LeaveTypeId);
    }

    [Fact]
    public void CreateLeaveRequest_ShouldFail_WhenReasonIsEmpty()
    {
        var dto = new CreateLeaveRequestDto
        {
            LeaveTypeId = Guid.NewGuid(),
            Reason = "",
            StartDate = DateOnly.FromDateTime(DateTime.Today),
            EndDate = DateOnly.FromDateTime(DateTime.Today)
        };

        var validator = new CreateLeaveRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Reason);
    }

    [Fact]
    public void CreateLeaveRequest_ShouldFail_WhenStartDateIsInThePast()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.Today).AddDays(-1);

        var dto = new CreateLeaveRequestDto
        {
            LeaveTypeId = Guid.NewGuid(),
            Reason = "Vacation",
            StartDate = pastDate,
            EndDate = DateOnly.FromDateTime(DateTime.Today)
        };

        var validator = new CreateLeaveRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.StartDate);
    }

    [Fact]
    public void CreateLeaveRequest_ShouldFail_WhenEndDateIsBeforeStartDate()
    {
        var startDate = DateOnly.FromDateTime(DateTime.Today).AddDays(2);
        var endDate = DateOnly.FromDateTime(DateTime.Today);

        var dto = new CreateLeaveRequestDto
        {
            LeaveTypeId = Guid.NewGuid(),
            Reason = "Vacation",
            StartDate = startDate,
            EndDate = endDate
        };

        var validator = new CreateLeaveRequestDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeFalse();
        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    // ============================================================
    // CreateLeaveTypeDtoValidator
    // ============================================================

    [Fact]
    public void CreateLeaveType_ShouldPass_WhenDataIsValid()
    {
        var dto = new CreateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 21
        };

        var validator = new CreateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateLeaveType_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new CreateLeaveTypeDto
        {
            Name = "",
            Description = "Annual vacation leave",
            DefaultDays = 21
        };

        var validator = new CreateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void CreateLeaveType_ShouldFail_WhenDefaultDaysIsZero()
    {
        var dto = new CreateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 0
        };

        var validator = new CreateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.DefaultDays);
    }

    [Fact]
    public void CreateLeaveType_ShouldFail_WhenDefaultDaysExceeds365()
    {
        var dto = new CreateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 366
        };

        var validator = new CreateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.DefaultDays);
    }

    // ============================================================
    // UpdateLeaveTypeDtoValidator
    // ============================================================

    [Fact]
    public void UpdateLeaveType_ShouldPass_WhenDataIsValid()
    {
        var dto = new UpdateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 21
        };

        var validator = new UpdateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateLeaveType_ShouldFail_WhenNameIsEmpty()
    {
        var dto = new UpdateLeaveTypeDto
        {
            Name = "",
            Description = "Annual vacation leave",
            DefaultDays = 21
        };

        var validator = new UpdateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void UpdateLeaveType_ShouldFail_WhenDefaultDaysIsZero()
    {
        var dto = new UpdateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 0
        };

        var validator = new UpdateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.DefaultDays);
    }

    [Fact]
    public void UpdateLeaveType_ShouldFail_WhenDefaultDaysExceeds365()
    {
        var dto = new UpdateLeaveTypeDto
        {
            Name = "Annual Leave",
            Description = "Annual vacation leave",
            DefaultDays = 366
        };

        var validator = new UpdateLeaveTypeDtoValidator();

        var result = validator.TestValidate(dto);

        result.ShouldHaveValidationErrorFor(x => x.DefaultDays);
    }
}