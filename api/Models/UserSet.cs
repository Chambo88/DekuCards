public class UserSet
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid SetId { get; set; }
    public Guid? ParentUserSetId { get; set; }
    public bool IsEditable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
