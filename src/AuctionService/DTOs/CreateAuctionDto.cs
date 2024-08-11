using System.ComponentModel.DataAnnotations;

namespace AuctionService.DTOs;

public class CreateAuctionDto
{
    [Required]
    public string Make { get; set; } = string.Empty;

    [Required]
    public string Model { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    public string Color { get; set; } = string.Empty;

    [Required]
    public int Mileage { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    public int ReservePrice { get; set; }

    [Required]
    public DateTime AuctionEnd { get; set; }
}
