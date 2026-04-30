export type MessageToClient =
    {type: "stateUpdate", state: string} |
    {type: "affirmationUpdate", nextAffirmation: number | undefined};
export type MessageToServiceWorker = {type: "activate"} | {type: "deactivate"} | {type: "init"};
export type NotificationAction = {
    /** A string identifying a user action to be displayed on the notification. */
    action: string;

    /** A string containing action text to be shown to the user. */
    title: string;

    /** A string containing the URL of an icon to display with the action. */
    icon?: string;
}
export type AffirmationActions = "again" | "stop";
export type AffirmationAction = NotificationAction & {action: AffirmationActions}