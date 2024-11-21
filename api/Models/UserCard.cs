public class UserCard
{
    public Guid UserId { get; set; }
    public Guid CardId { get; set; }
    public DateTime? LastShownAt { get; set; }
    public int TimesCorrect { get; set; }
    public int TimesIncorrect { get; set; }
    public DateTime? ScheduledNextShow { get; set; }
}
