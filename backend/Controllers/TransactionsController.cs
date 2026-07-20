using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions.Include(t => t.Person).ToListAsync();
    }

    // POST: api/transactions
    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        var person = await _context.Persons.FindAsync(transaction.PersonId);
        if (person == null)
        {
            return BadRequest("Pessoa não encontrada.");
        }

        if (person.Age < 18 && transaction.Type == TransactionType.Income)
        {
            return BadRequest("Menores de idade só podem ter despesas cadastradas.");
        }

        // Não salvar a entidade Person que vem no payload, apenas referenciar o ID
        transaction.Person = null; 

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, transaction);
    }
}
