public class Set
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid CreatedBy { get; set; }
    public bool IsPublic { get; set; }
    public Guid? OriginalSetId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
