public class Card
{
    public Guid Id { get; set; }
    public string Question { get; set; }
    public string Answer { get; set; }
    public Guid SetId { get; set; }
    public Guid? OriginalCardId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
