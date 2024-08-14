using System;
using MongoDB.Entities;

namespace BiddingService.Models;

public class Bid : Entity
{
    public required string AuctionId { get; set; }
    public required string Bidder { get; set; }
    public DateTime BidTime { get; set; } = DateTime.UtcNow;
    public int Amount { get; set; }
    public BidStatus BidStatus { get; set; }
}