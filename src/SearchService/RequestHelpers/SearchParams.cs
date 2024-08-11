using System;

namespace SearchService.RequestHelpers;

public class SearchParams
{
    public string? SearchTerm { get; set; }
    public int PageSize { get; set; } = 4;
    public int PageNumber { get; set; } = 1;
    public string? Seller { get; set; }
    public string? Winner { get; set; }
    public string? OrderBy { get; set; }
    public string? FilterBy { get; set; }
}
