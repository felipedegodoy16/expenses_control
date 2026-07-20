using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PersonsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/persons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Person>>> GetPersons()
    {
        return await _context.Persons.ToListAsync();
    }

    // POST: api/persons
    [HttpPost]
    public async Task<ActionResult<Person>> PostPerson(Person person)
    {
        _context.Persons.Add(person);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPersons), new { id = person.Id }, person);
    }

    // DELETE: api/persons/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePerson(int id)
    {
        var person = await _context.Persons.FindAsync(id);
        if (person == null)
        {
            return NotFound();
        }

        // TODO: Ao adicionar Transações, garantir a deleção em cascata
        _context.Persons.Remove(person);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
