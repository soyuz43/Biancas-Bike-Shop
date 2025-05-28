using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiancasBikes.Data;
using Microsoft.EntityFrameworkCore;
using BiancasBikes.Models;
using BiancasBikes.Models.DTOs;

namespace BiancasBikes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BikeController : ControllerBase
{
    private BiancasBikesDbContext _dbContext;

    public BikeController(BiancasBikesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        var bikes = _dbContext
            .Bikes
            .Include(b => b.Owner)
            .Select(b => new BikeDTO
            {
                Id = b.Id,
                Brand = b.Brand,
                Color = b.Color,
                BikeTypeId = b.BikeTypeId,
                OwnerId = b.OwnerId,
                Owner = new OwnerDTO
                {
                    Id = b.Owner.Id,
                    Name = b.Owner.Name
                }
            })
            .ToList();

        return Ok(bikes);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        var bike = _dbContext
            .Bikes
            .Include(b => b.Owner)
            .Include(b => b.BikeType)
            .Include(b => b.WorkOrders)
            .SingleOrDefault(b => b.Id == id);

        if (bike == null) return NotFound();

        var dto = new BikeDTO
        {
            Id = bike.Id,
            Brand = bike.Brand,
            Color = bike.Color,
            BikeTypeId = bike.BikeTypeId,
            OwnerId = bike.OwnerId,
            BikeType = new BikeTypeDTO
            {
                Id = bike.BikeType.Id,
                Name = bike.BikeType.Name
            },
            Owner = new OwnerDTO
            {
                Id = bike.Owner.Id,
                Name = bike.Owner.Name,
                Address = bike.Owner.Address
            },
            WorkOrders = bike.WorkOrders.Select(wo => new WorkOrderDTO
            {
                Id = wo.Id,
                Description = wo.Description,
                DateInitiated = wo.DateInitiated,
                DateCompleted = wo.DateCompleted
            }).ToList()
        };

        return Ok(dto);
    }
}
