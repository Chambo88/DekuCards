using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using api.Services;
using api.Models;

[ApiController]
[Route("api/[controller]")]
public class SetController : ControllerBase
{
    private readonly SetService _setService;

    public SetController(SetService setService)
    {
        _setService = setService;
    }

    [HttpGet("User/{userId}")]
    public async Task<IActionResult> GetSetsByUserId(Guid userId)
    {
        var sets = await _setService.GetSetsByUserIdAsync(userId);
        return Ok(sets);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSet([FromBody] Set set)
    {
        if (set == null)
            return BadRequest();

        var setId = await _setService.CreateSetAsync(set);
        return CreatedAtAction(nameof(GetSetById), new { id = setId }, set);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSetById(Guid id)
    {
        var set = await _setService.GetSetByIdAsync(id);
        if (set == null)
            return NotFound();

        return Ok(set);
    }

    // Additional endpoints for updating and deleting sets
}
