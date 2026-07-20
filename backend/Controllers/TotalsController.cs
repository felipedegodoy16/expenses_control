using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TotalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTotals()
    {
        var persons = await _context.Persons.Include(p => p.Transactions).ToListAsync();

        var personTotals = persons.Select(p => {
            var incomes = p.Transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
            var expenses = p.Transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);
            
            return new {
                personId = p.Id,
                personName = p.Name,
                totalIncomes = incomes,
                totalExpenses = expenses,
                netBalance = incomes - expenses
            };
        }).ToList();

        var globalIncomes = personTotals.Sum(p => p.totalIncomes);
        var globalExpenses = personTotals.Sum(p => p.totalExpenses);
        var globalBalance = globalIncomes - globalExpenses;

        return Ok(new {
            persons = personTotals,
            global = new {
                totalIncomes = globalIncomes,
                totalExpenses = globalExpenses,
                netBalance = globalBalance
            }
        });
    }
}
