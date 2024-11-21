using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;

namespace YourApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;
        private readonly ISetService _setService;

        public CardsController(ICardService cardService, ISetService setService)
        {
            _cardService = cardService;
            _setService = setService;
        }

        [HttpGet("Set/{setId}")]
        public async Task<IActionResult> GetCardsBySetId(Guid setId)
        {
            if (!await UserHasAccessToSet(setId))
                return Forbid();

            var cards = await _cardService.GetCardsBySetIdAsync(setId);
            return Ok(cards);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCard([FromBody] Card card)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await UserCanEditSet(card.SetId))
                return Forbid();

            var createdCard = await _cardService.CreateCardAsync(card);
            return CreatedAtAction(nameof(GetCardById), new { id = createdCard.Id }, createdCard);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCardById(Guid id)
        {
            var card = await _cardService.GetCardByIdAsync(id);
            if (card == null)
                return NotFound();

            if (!await UserHasAccessToSet(card.SetId))
                return Forbid();

            return Ok(card);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCard(Guid id, [FromBody] Card card)
        {
            if (id != card.Id)
                return BadRequest();

            if (!await UserCanEditSet(card.SetId))
                return Forbid();

            var updatedCard = await _cardService.UpdateCardAsync(card);
            return Ok(updatedCard);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(Guid id)
        {
            var card = await _cardService.GetCardByIdAsync(id);
            if (card == null)
                return NotFound();

            if (!await UserCanEditSet(card.SetId))
                return Forbid();

            await _cardService.DeleteCardAsync(id);
            return NoContent();
        }

        private Guid GetUserIdFromToken()
        {
            // Implement logic to extract user ID from JWT or auth token
            return Guid.Parse(User.FindFirst("sub").Value);
        }

        private async Task<bool> UserHasAccessToSet(Guid setId)
        {
            var set = await _setService.GetSetByIdAsync(setId);
            return set.IsPublic || set.CreatedBy == GetUserIdFromToken();
        }

        private async Task<bool> UserCanEditSet(Guid setId)
        {
            var set = await _setService.GetSetByIdAsync(setId);
            return set.CreatedBy == GetUserIdFromToken();
        }
    }
}
